import { SocketHandler } from './barrels/handlers'
import { playerService, jsonService, rxService } from './barrels/services'
import { App } from '../app'

import stringify = require('json-stringify-safe');
var MAX_SCORE = 4;
import events = require('events');
var eventEmitter = new events.EventEmitter();
var isLimitReached = false;
//eventEmitter.on('Limit Reached', limitReached);


class Board {
    private _name: string;
    private _socketHandler;
    constructor(name: string, app: App) {
        this._name = name;
        this._socketHandler = new SocketHandler(this);
       this.initInstance(app.http);
        let self = this;
        var playerSubscription = rxService.getPlayerSubject().subscribe(function (player) {
            self.boardData.players[player.data.playerId] = player;
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
        var blackCardSubscription = rxService.getBlackCardSubject().subscribe(function (blackCard) {
            self.boardData.display.blackCard = blackCard;
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
        var whiteCardSubscription = rxService.getWhiteCardSubject().subscribe(function (whiteCard) {
            self.boardData.players[whiteCard.owner].data.hand.push(whiteCard);
            self.updatePlayersInDisplay();
            self.updateCurrentDisplay();
        });
    }
    boardData = {
        phase: 0,
        Phases: Object.freeze(
            {
                "startGame": 0,
                "submission": 1,
                "judgement": 2,
                "updateScore": 3,
                "four": 4,
                "endGame": 5
            }
        ),
        players: {},
        display: {
            "blackCard": null, //This should be a black card object
            "submissions": [],
            "currentJudge": '', // The player ID of the person who is the judge
            "players": []
        },
        INSTANCE_ID: -1,
        generateInstanceId: function () {
            if(this.INSTANCE_ID === -1){
                this.INSTANCE_ID = Date.now();
                return this.INSTANCE_ID;
            }
            return this.INSTANCE_ID;
        }
    };
    initInstance (http) {
        this.socketHandler.start(http);
        return this.boardData.generateInstanceId();
    }
    getPlayers () {
        return this.boardData.players;
    }
    getDisplay () {
        return this.boardData.display;
    }
    getInstanceId () {
        return this.boardData.INSTANCE_ID;
    }
    setPlayers (players) {
       this.boardData.players = players;
    }
    setDisplay (display) {
        this.boardData.display = display;
    }
    getPlayerName (socketId) {
        return this.boardData.players[socketId].data.playerName;
    }
    joinedPlayer (playerName, socket, socketid) {
        console.log(playerName);
        playerService.createPlayer(playerName, socket, socketid);
        this.updatePlayersInDisplay();
    }
    removePlayer (playerId) {
        isLimitReached = false;
        if(this.boardData.players[playerId]){
            this.boardData.players[playerId].socket.disconnect(true);
        }
        delete this.boardData.players[playerId];
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
    }
    startGame () {
        if(this.boardData.phase !== this.boardData.Phases.startGame){
            return false;
        }
        jsonService.getNewBlackCard();
        this.boardData.players[Object.keys(this.boardData.players)[0]].data.isJudge = true;
        this.boardData.display.currentJudge = this.boardData.players[Object.keys(this.boardData.players)[0]].data.playerId;
        this.updatePlayersInDisplay();
        this.boardData.phase = this.boardData.Phases.submission;
        this.updateCurrentDisplay();
    }
    submission (whiteCard) {
        if (this.boardData.phase !== this.boardData.Phases.submission) {
            console.log('submission failed because incorrect phase');
            return false;
        }
        console.log(Object.keys(this.boardData.players) + ' ,' + this.boardData.display.currentJudge);
        console.log(whiteCard);
        if(this.boardData.display.currentJudge === whiteCard.owner){
            return false;
        }
        //console.log('attempting to find id ' + whiteCard.owner + ' of \n' + this.players[whiteCard.owner]);
        var playerLocation = this.boardData.players[whiteCard.owner].data.hand.findIndex(function (element) {
            return (whiteCard.cardId === element.cardId);
        });
        //console.log(playerLocation);
        // NOTE!!!! Splice splices out an array, even if its size 0
        this.boardData.display.submissions.push(this.boardData.players[whiteCard.owner].data.hand.splice(playerLocation, 1)[0]);
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
        //console.log(this.display.submissions.length);
        //console.log(Object.keys(this.players).length - 1);
        if (this.boardData.display.submissions.length >= Object.keys(this.boardData.players).length - 1) {
            this.boardData.phase = this.boardData.Phases.judgement;
            // console.log('this.display.submissions.length >= Object.keys(this.players).length - 1');
        }
        return true; //error handling maybe? Can't hurt
    }
    judgement (whiteCard) {
        if (this.boardData.phase !== this.boardData.Phases.judgement) {
            return false;
        }
        this.boardData.phase = this.boardData.Phases.updateScore;
        this.updateScore(whiteCard.owner);
        return true;
    }
    updateScore (playerId) {
        if (this.boardData.phase !== this.boardData.Phases.updateScore) {
            return false;
        }
        this.boardData.players[playerId].data.score += 1;
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();

        if (this.boardData.players[playerId].score > MAX_SCORE) { // This variable dictates how long the games go oops.
            this.endGame(playerId);
        } else {
            this.boardData.phase = this.boardData.Phases.four;
            this.phase4();
        }
        return true;
    }
    phase4 () {
        if (this.boardData.phase !== this.boardData.Phases.four) {
            return false;
        }

        // Adds a new black card to current display
        jsonService.getNewBlackCard();

        // Adds a new white card to each hand
        this.boardData.display.submissions = [];
        var key;
        var keys = Object.keys(this.boardData.players);
        console.log(keys);
        for (key in keys) {
            console.log(key);
            if (keys[key] !== this.boardData.display.currentJudge) {
                jsonService.getNewWhiteCard(keys[key]);
            }
        }
        key = null;

        // Sets current judge to not judge. Might not need in the future.
        this.boardData.players[this.boardData.display.currentJudge].data.isJudge = false;
        //console.log(Object.keys(this.players));

        // Selects next judge
        this.boardData.display.currentJudge = Object.keys(this.boardData.players)[Math.round((Object.keys(this.boardData.players).length - 1) * Math.random())];
        //console.log(this.display.currentJudge + ' is judge');
        this.boardData.players[this.boardData.display.currentJudge].data.isJudge = true;

        // Start next round. This will be rearranged
        this.updatePlayersInDisplay();
        this.updateCurrentDisplay();
        this.boardData.phase = this.boardData.Phases.submission;
        console.log('here I am ' + this.boardData.phase);
        return true;
    }
    endGame (playerId) {
      this.socketHandler.emit('result', playerId);
      setTimeout(function () {
        this.socketHandler.emit('reset', null)
      }, 3000)
    }
    reset () {
        this.boardData.phase = 0;
        this.boardData.players = {};
        this.boardData.display = {
            "blackCard": null, //This should be a black card object
            "submissions": [],
            "currentJudge": '', // The player ID of the person who is the judge
            "players": []
        };
        this.updateCurrentDisplay();
    }
    updateCurrentDisplay () {
        this.socketHandler.emit('updateDisplay', this.getDisplay());
    }
    updatePlayersInDisplay () {
        this.boardData.display.players = [];
        for (var i = 0; i < Object.keys(this.boardData.players).length; i++) {
            if (Object.keys(this.boardData.players).length == 3) {
                eventEmitter.emit('Limit Reached');
            }
            this.boardData.display.players.push(this.boardData.players[Object.keys(this.boardData.players)[i]].data);
        }
    }//Decided to implement this as a function in the end cuz prior approach would only update display at user join time.
    isLimitReached() {
        return isLimitReached;
    }

    get name(): string {
        return this._name;
    }
    get socketHandler(): SocketHandler {
        return this._socketHandler;
    }
}

export default Board;

// var instance;
// var jsonHandler = require('../api/jsonHandler.ts');
// var io = require('../services/socketService.ts')().io;
// const MAX_SCORE = 4;
//
// module.exports = function () {
//     if (!instance) {
//         instance = {
//             Phases: Object.freeze(
//                 {
//                     "startGame": 0,
//                     "submission": 1,
//                     "judgement": 2,
//                     "updateScore": 3,
//                     "four": 4,
//                     "endGame": 5
//                 }
//             ),
//             phase: 0,
//             players: {},
//             display: {
//                 "blackCard": null, //This should be a black card object
//                 "submissions": [],
//                 "currentJudge": '', // The player ID of the person who is the judge
//                 "players": []
//             },
//
//             getDisplay: function () {
//                 return this.display;
//             },
//
//             joinPlayer: function (player, playerId) {
//                 this.players[playerId] = player;
//                 this.display.players.push(player.data);
//                 this.updateCurrentDisplay();
//             },
//
//             instanceNumber: Math.random(),
//
//             getPlayerName: function (socketId) {
//                 return this.players[socketId].data.playerName;
//             },
//
//             removePlayer: function (playerId) {
//                 this.players[playerId].socket.disconnect(true);
//                 delete this.players[playerId];
//                 console.log(Object.keys(this.players).length + ' is left in the game');
//                 this.updatePlayersInDisplay();
//                 this.updateCurrentDisplay();
//             },
//
//             startGame: function () {
//                 var display = this.display;
//                 var this = this;
//                 jsonHandler.createBlackCard(function (card) {
//                     display.blackCard = card;
//                     this.updatePlayersInDisplay();
//                     this.updateCurrentDisplay();
//                 });
//                 this.players[Object.keys(this.players)[0]].data.isJudge = true;
//                 this.display.currentJudge = this.players[Object.keys(this.players)[0]].data.playerId;
//                 //console.log(Object.keys(this.players)[0] + ' is the first judge'); // Should be io.emit
//                 this.phase = this.Phases.submission;
//                 console.log('startGame :');
//                 //console.log(this.display);
//             },
//
//             submission: function (whiteCard) {
//                 if (this.phase !== this.Phases.submission) {
//                     console.log(this.phase);
//                     return false;
//                 }
//                 //console.log('attempting to find id ' + whiteCard.owner + ' of \n' + this.players[whiteCard.owner]);
//                 var playerLocation = this.players[whiteCard.owner].data.hand.findIndex(function (element) {
//                     return (whiteCard.cardId === element.cardId)
//                 });
//                 //console.log(playerLocation);
//                 // NOTE!!!! Splice splices out an array, even if its size 0
//                 this.display.submissions.push(this.players[whiteCard.owner].data.hand.splice(playerLocation, 1)[0]);
//                 this.updatePlayersInDisplay();
//                 this.updateCurrentDisplay();
//                 //console.log(this.display.submissions.length);
//                 //console.log(Object.keys(this.players).length - 1);
//                 if (this.display.submissions.length >= Object.keys(this.players).length - 1) {
//                     this.phase = this.Phases.judgement;
//                     // console.log('this.display.submissions.length >= Object.keys(this.players).length - 1');
//                 }
//                 return true; //error handling maybe? Can't hurt
//             },
//
//             judgement: function (whiteCard) {
//                 if (this.phase !== this.Phases.judgement) {
//                     return false;
//                 }
//                 this.phase = this.Phases.updateScore;
//                 this.updateScore(whiteCard.owner);
//                 return true;
//             },
//
//             updateScore: function (playerId) {
//                 if (this.phase !== this.Phases.updateScore) {
//                     return false;
//                 }
//                 this.players[playerId].data.score += 1;
//                 this.updatePlayersInDisplay();
//                 this.updateCurrentDisplay();
//
//                 if (this.players[playerId].score > MAX_SCORE) { // This variable dictates how long the games go oops.
//                     this.endGame(playerId);
//                 } else {
//                     this.phase = this.Phases.four;
//                     this.phase4();
//                 }
//                 return true;
//             },
//
//             phase4: function () {
//                 if (this.phase !== this.Phases.four) {
//                     return false;
//                 }
//
//                 // Adds a new black card to current display
//                 var display = this.display;
//                 var this = this;
//                 jsonHandler.createBlackCard(function (card) {
//                     display.blackCard = card;
//                     this.updatePlayersInDisplay();
//                     this.updateCurrentDisplay();
//                 });
//
//                 // Adds a new white card to each hand
//                 this.display.submissions = [];
//                 var key;
//                 var keys = Object.keys(this.players);
//                 //console.log(keys);
//                 for (key in keys) {
//                     //console.log(key);
//                     if (key !== this.display.currentJudge) {
//                         console.log(key);
//                         jsonHandler.createWhiteCard(key, function (card) {
//                             this.players[keys].data.hand.push();
//                         });
//                     }
//                 }
//                 key = null;
//
//                 // Sets current judge to not judge. Might not need in the future.
//                 this.players[this.display.currentJudge].data.isJudge = false;
//                 //console.log(Object.keys(this.players));
//
//                 // Selects next judge
//                 this.display.currentJudge = Object.keys(this.players)[Math.round((Object.keys(this.players).length - 1) * Math.random())];
//                 //console.log(this.display.currentJudge + ' is judge');
//                 this.players[this.display.currentJudge].data.isJudge = true;
//
//                 // Start next round. This will be rearranged
//                 this.updatePlayersInDisplay();
//                 this.updateCurrentDisplay();
//                 this.phase = this.Phases.submission;
//                 console.log('here I am ' + this.phase);
//                 return true;
//             },
//
//             updatePlayersInDisplay: function () {
//                 this.display.players = [];
//                 for (var i = 0; i < Object.keys(this.players).length; i++) {
//                     this.display.players.push(this.players[Object.keys(this.players)[i]].data);
//                     //console.log(this.players[Object.keys(this.players)[i]].data);
//                 }
//             },
//
//             updateCurrentDisplay: function () {
//                 io.emit('updateDisplay', this.getDisplay());
//             }, //Decided to implement this as a function in the end cuz prior approach would only update display at user join time.
//
//             findPlayerInDisplay: function (playerId) {
//                 return this.display.players.findIndex(function (value) {
//                         return (value.playerId === playerId);
//                     }
//                 )
//             },
//
//             endGame: function (winnerID) {
//                 console.log(this.players[winnerID].name + ' won!')
//                 this.reset();
//             },
//
//             reset: function () {
//                 this.phase = 0;
//                 this.players = {};
//                 this.display = {
//                     "blackCard": null, //This should be a black card object
//                     "submissions": [],
//                     "currentJudge": '', // The player ID of the person who is the judge
//                     "players": []
//                 };
//                 this.updateCurrentDisplay();
//             }
//         };
//     }
//     return instance;
// };
