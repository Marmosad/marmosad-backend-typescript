"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonHandler = require("./jsonHandler");
var rxService = require("../dataServices/rxService");
var playerSubject = rxService.getPlayerSubject();
//rewrite as module in typescript
var playerHandler = /** @class */ (function () {
    function playerHandler() {
    }
    playerHandler.prototype.createPlayer = function (playerName, socket, socketid) {
        jsonHandler.createPlayer(function (hand) {
            playerSubject.next({
                data: {
                    "playerName": playerName,
                    "playerId": socketid,
                    "hand": hand,
                    "isJudge": false,
                    "score": 0
                },
                socket: socket
            });
        }, socketid);
    };
    return playerHandler;
}());
exports.default = new playerHandler();
