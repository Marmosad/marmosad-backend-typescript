"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonHandler_1 = require("./jsonHandler");
var rxService_1 = require("../dataServices/rxService");
var playerSubject = rxService_1.default.getPlayerSubject();
//rewrite as module in typescript
var playerHandler = /** @class */ (function () {
    function playerHandler() {
    }
    playerHandler.prototype.createPlayer = function (playerName, socket, socketid) {
        jsonHandler_1.default.createPlayer(function (hand) {
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
