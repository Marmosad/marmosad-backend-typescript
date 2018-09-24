import { SocketHandler, PlayerHandler, RxHandler } from './barrels/handlers'
// import { playerService, jsonService, rxService } from './barrels/services'
import { App } from '../app'
import { container } from './services/containerService';
import { TYPES } from "./models/types";
import { JsonInterface, JsonService } from "./services/jsonService";

import stringify = require('json-stringify-safe');
var MAX_SCORE = 4;
import events = require('events');
import { BoardInfo, Phases, BoardDisplay, InstanceId } from './models/boardModel';
import { PlayerData, Player, Players } from './models/playerModel';
import { WhiteCardModel, BlackCardModel } from './models/jsonModel';
var eventEmitter = new events.EventEmitter();
//eventEmitter.on('Limit Reached', limitReached);


class Board {
    public boardInfo: BoardInfo;

    private _socketHandler: SocketHandler;
    private jsonService: JsonInterface;
    private phase = Phases.startGame;

    private players = new Players();
    private display = new BoardDisplay();
    
    private playerHandler: PlayerHandler;

    constructor(
        boardInfo: BoardInfo,
        app: App,
        _jsonService: JsonInterface,
        ) {
        this.playerHandler = new PlayerHandler(_jsonService);
        this.jsonService = _jsonService;

        this.boardInfo = boardInfo;
        boardInfo.socketUrl = boardInfo.name;
        this._socketHandler = new SocketHandler(this);

        this.initInstance(app.http);
        let self = this;
        this.playerHandler.rxHandler.getPlayerSubject().subscribe(function (player) {
            self.players[player.data.playerId] = player;
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
        this.playerHandler.rxHandler.getBlackCardSubject().subscribe(function (blackCard: BlackCardModel) {
            self.display.blackCard = blackCard;
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
        this.playerHandler.rxHandler.getWhiteCardSubject().subscribe(function (whiteCard: WhiteCardModel) {
            self.players[whiteCard.owner].data.hand.push(whiteCard);
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
    }
    // get date instance
    initInstance (http): InstanceId {
        this.socketHandler.start(http);
        return this.boardInfo.instanceId;
    }
    getPlayers (): Players {
        return this.players;
    }
    getDisplay (): BoardDisplay {
        return this.display;
    }
    getInstanceId (): InstanceId {
        return this.boardInfo.instanceId;
    }
    setPlayers (players: Players): void {
       this.players = players;
    }
    setDisplay (display: BoardDisplay): void {
        this.display = display;
    }
    getPlayerName (socketId: string): string {
        return this.players[socketId].data.playerName;
    }
    // makes player, calls upadte players, checks if player limit is reached
    joinedPlayer (playerName: string, socket: any, socketid: string): void {
        this.playerHandler.createPlayer(playerName, socket, socketid);
        this.updatePlayersInDisplay();
        this.boardInfo.numberOfPlayers = Object.keys(this.players).length + 1;
        this.boardInfo.playerLimitReached = this.boardInfo.numberOfPlayers >= this.boardInfo.playerLimit;
    }
    removePlayer (playerId: string): void {
        if(this.players[playerId]){
            this.players[playerId].socket.disconnect(true);
        }
        delete this.players[playerId];
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
        this.boardInfo.numberOfPlayers = Object.keys(this.players).length;
        this.boardInfo.playerLimitReached = this.boardInfo.numberOfPlayers > this.boardInfo.playerLimit;
    }
    updateBoardInfo(newBoardInfo: BoardInfo): BoardInfo {
        this.boardInfo = newBoardInfo;
        return this.boardInfo;
    }
    // check return type
    startGame () {  
        if(this.phase !== Phases.startGame){
            return false;
        }
        this.playerHandler.rxHandler.getNewBlackCard();
        this.players[Object.keys(this.players)[0]].data.isJudge = true;
        this.display.currentJudge = this.players[Object.keys(this.players)[0]].data.playerId;
        this.updatePlayersInDisplay();
        this.phase = Phases.submission;
        this.updateCurrentDisplay();
    }
    submission (whiteCard: WhiteCardModel): boolean {
        if (this.phase !== Phases.submission) {
            console.log('submission failed because incorrect phase');
            return false;
        }
        console.log(Object.keys(this.players) + ' ,' + this.display.currentJudge);
        console.log(whiteCard);
        if(this.display.currentJudge === whiteCard.owner){
            return false;
        }
        //console.log('attempting to find id ' + whiteCard.owner + ' of \n' + this.players[whiteCard.owner]);
        var playerLocation = this.players[whiteCard.owner].data.hand.findIndex(function (element) {
            return (whiteCard.cardId === element.cardId);
        });
        //console.log(playerLocation);
        // NOTE!!!! Splice splices out an array, even if its size 0
        this.display.submissions.push(this.players[whiteCard.owner].data.hand.splice(playerLocation, 1)[0]);
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
        //console.log(this.display.submissions.length);
        //console.log(Object.keys(this.players).length - 1);
        if (this.display.submissions.length >= Object.keys(this.players).length - 1) {
            this.phase = Phases.judgement;
            // console.log('this.display.submissions.length >= Object.keys(this.players).length - 1');
        }
        return true; //error handling maybe? Can't hurt
    }
    judgement (whiteCard: WhiteCardModel): boolean {
        if (this.phase !== Phases.judgement) {
            return false;
        }
        this.phase = Phases.updateScore;
        this.updateScore(whiteCard.owner);
        return true;
    }
    updateScore (playerId: string): boolean {
        if (this.phase !== Phases.updateScore) {
            return false;
        }
        this.players[playerId].data.score += 1;
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();

        if (this.players[playerId].data.score > MAX_SCORE) { // This variable dictates how long the games go oops.
            this.endGame(playerId);
        } else {
            this.phase = Phases.four;
            this.phase4();
        }
        return true;
    }
    phase4 (): boolean {
        if (this.phase !== Phases.four) {
            return false;
        }

        // Adds a new black card to current display
        this.playerHandler.rxHandler.getNewBlackCard();

        // Adds a new white card to each hand
        this.display.submissions = [];
        var key;
        var keys = Object.keys(this.players);
        console.log(keys);
        for (key in keys) {
            console.log(key);
            if (keys[key] !== this.display.currentJudge) {
                this.playerHandler.rxHandler.getNewWhiteCard(keys[key]);
            }
        }
        key = null;

        // Sets current judge to not judge. Might not need in the future.
        this.players[this.display.currentJudge].data.isJudge = false;
        //console.log(Object.keys(this.players));

        // Selects next judge
        this.display.currentJudge = Object.keys(this.players)[Math.round((Object.keys(this.players).length - 1) * Math.random())];
        //console.log(this.display.currentJudge + ' is judge');
        this.players[this.display.currentJudge].data.isJudge = true;

        // Start next round. This will be rearranged
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
        this.phase = Phases.submission;
        console.log('here I am ' + this.phase);
        return true;
    }
    endGame (playerId: string): void {
      this.socketHandler.emit('result', playerId);
      setTimeout(function () {
        this.socketHandler.emit('resetBoard', null)
      }, 3000)
    }
    reset (): void {
        this.phase = 0;
        this.players = new Players();
        this.display = new BoardDisplay();
        this.updateCurrentDisplay();
    }
    updateCurrentDisplay (): void {
        this.socketHandler.emit('updateDisplay', this.getDisplay());
    }
    //
    updatePlayersInDisplay (): void {
        this.display.players = [];
        for (var i = 0; i < Object.keys(this.players).length; i++) {
            this.display.players.push(this.players[Object.keys(this.players)[i]].data);
        }
        console.log(this.display.players);
         
    }//Decided to implement this as a function in the end cuz prior approach would only update display at user join time.

    get name(): string {
        return this.boardInfo.name;
    }
    get socketHandler(): SocketHandler {
        return this._socketHandler;
    }
}

export default Board;
