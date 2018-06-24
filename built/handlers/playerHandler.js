"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsonHandler = require("./jsonHandler");
var rxService = require("../dataServices/rxService");
var playerSubject = rxService.getPlayerSubject();
//rewrite as module in typescript
var self = module.exports = {
    createPlayer: function (playerName, socket, socketid) {
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
    }
};
