"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlers_1 = require("./barrels/handlers");
var MAX_SCORE = 4;
var events = require("events");
var boardModel_1 = require("./models/boardModel");
var playerModel_1 = require("./models/playerModel");
var eventEmitter = new events.EventEmitter();
//eventEmitter.on('Limit Reached', limitReached);
var Board = /** @class */ (function () {
    function Board(boardInfo, app, _jsonService) {
        this.phase = boardModel_1.Phases.startGame;
        this.players = new playerModel_1.Players();
        this.display = new boardModel_1.BoardDisplay();
        this.playerHandler = new handlers_1.PlayerHandler(_jsonService);
        this.jsonService = _jsonService;
        this.boardInfo = boardInfo;
        boardInfo.socketUrl = boardInfo.name;
        this._socketHandler = new handlers_1.SocketHandler(this);
        this.initInstance(app.http);
        var self = this;
        this.playerHandler.rxHandler.getPlayerSubject().subscribe(function (player) {
            self.players[player.data.playerId] = player;
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
        this.playerHandler.rxHandler.getBlackCardSubject().subscribe(function (blackCard) {
            self.display.blackCard = blackCard;
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
        this.playerHandler.rxHandler.getWhiteCardSubject().subscribe(function (whiteCard) {
            self.players[whiteCard.owner].data.hand.push(whiteCard);
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
    }
    // get date instance
    Board.prototype.initInstance = function (http) {
        this.socketHandler.start(http);
        return this.boardInfo.instanceId;
    };
    Board.prototype.getPlayers = function () {
        console.log(this.players);
        return this.players;
    };
    Board.prototype.getDisplay = function () {
        return this.display;
    };
    Board.prototype.getInstanceId = function () {
        return this.boardInfo.instanceId;
    };
    Board.prototype.setPlayers = function (players) {
        this.players = players;
    };
    Board.prototype.setDisplay = function (display) {
        this.display = display;
    };
    Board.prototype.getPlayerName = function (socketId) {
        return this.players[socketId].data.playerName;
    };
    // makes player, calls upadte players, checks if player limit is reached
    Board.prototype.joinedPlayer = function (playerName, socket, socketid) {
        this.playerHandler.createPlayer(playerName, socket, socketid);
        this.updatePlayersInDisplay();
        this.boardInfo.numberOfPlayers = Object.keys(this.players).length;
        console.log(this.boardInfo.numberOfPlayers, '>', this.boardInfo.playerLimit);
        this.boardInfo.playerLimitReached = this.boardInfo.numberOfPlayers > this.boardInfo.playerLimit;
    };
    Board.prototype.removePlayer = function (playerId) {
        if (this.players[playerId]) {
            this.players[playerId].socket.disconnect(true);
        }
        delete this.players[playerId];
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
        this.boardInfo.numberOfPlayers = Object.keys(this.players).length;
        this.boardInfo.playerLimitReached = this.boardInfo.numberOfPlayers > this.boardInfo.playerLimit;
    };
    Board.prototype.updateBoardInfo = function (newBoardInfo) {
        this.boardInfo = newBoardInfo;
        return this.boardInfo;
    };
    // check return type
    Board.prototype.startGame = function () {
        if (this.phase !== boardModel_1.Phases.startGame) {
            return false;
        }
        this.playerHandler.rxHandler.getNewBlackCard();
        this.players[Object.keys(this.players)[0]].data.isJudge = true;
        this.display.currentJudge = this.players[Object.keys(this.players)[0]].data.playerId;
        this.updatePlayersInDisplay();
        this.phase = boardModel_1.Phases.submission;
        this.updateCurrentDisplay();
    };
    Board.prototype.submission = function (whiteCard) {
        if (this.phase !== boardModel_1.Phases.submission) {
            console.log('submission failed because incorrect phase');
            return false;
        }
        console.log(Object.keys(this.players) + ' ,' + this.display.currentJudge);
        // console.log(whiteCard);
        if (this.display.currentJudge === whiteCard.owner) {
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
            this.phase = boardModel_1.Phases.judgement;
            // console.log('this.display.submissions.length >= Object.keys(this.players).length - 1');
        }
        return true; //error handling maybe? Can't hurt
    };
    Board.prototype.judgement = function (whiteCard) {
        if (this.phase !== boardModel_1.Phases.judgement) {
            return false;
        }
        this.phase = boardModel_1.Phases.updateScore;
        this.updateScore(whiteCard.owner);
        return true;
    };
    Board.prototype.updateScore = function (playerId) {
        if (this.phase !== boardModel_1.Phases.updateScore) {
            return false;
        }
        this.players[playerId].data.score += 1;
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
        if (this.players[playerId].data.score > MAX_SCORE) { // This variable dictates how long the games go oops.
            this.endGame(playerId);
        }
        else {
            this.phase = boardModel_1.Phases.four;
            this.phase4();
        }
        return true;
    };
    Board.prototype.phase4 = function () {
        if (this.phase !== boardModel_1.Phases.four) {
            return false;
        }
        // Adds a new black card to current display
        this.playerHandler.rxHandler.getNewBlackCard();
        // Adds a new white card to each hand
        this.display.submissions = [];
        var key;
        var keys = Object.keys(this.players);
        // console.log(keys);
        for (key in keys) {
            // console.log(key);
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
        this.phase = boardModel_1.Phases.submission;
        console.log('here I am ' + this.phase);
        return true;
    };
    Board.prototype.endGame = function (playerId) {
        this.socketHandler.emit('result', playerId);
        setTimeout(function () {
            this.socketHandler.emit('reset', null);
        }, 3000);
    };
    Board.prototype.reset = function () {
        this.phase = 0;
        this.players = new playerModel_1.Players();
        this.display = new boardModel_1.BoardDisplay();
        this.updateCurrentDisplay();
    };
    Board.prototype.updateCurrentDisplay = function () {
        this.socketHandler.emit('updateDisplay', this.getDisplay());
    };
    //
    Board.prototype.updatePlayersInDisplay = function () {
        this.display.players = [];
        for (var i = 0; i < Object.keys(this.players).length; i++) {
            this.display.players.push(this.players[Object.keys(this.players)[i]].data);
        }
        // console.log(this.display.players);
    }; //Decided to implement this as a function in the end cuz prior approach would only update display at user join time.
    Object.defineProperty(Board.prototype, "name", {
        get: function () {
            return this.boardInfo.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "socketHandler", {
        get: function () {
            return this._socketHandler;
        },
        enumerable: true,
        configurable: true
    });
    return Board;
}());
exports.default = Board;
