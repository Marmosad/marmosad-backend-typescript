"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlers_1 = require("../barrels/handlers");
var PlayerHandler = /** @class */ (function () {
    function PlayerHandler(_jsonService) {
        this.jsonService = _jsonService;
        this.rxHandler = new handlers_1.RxHandler(this.jsonService.dbService);
        this.playerSubject = this.rxHandler.getPlayerSubject();
    }
    PlayerHandler.prototype.createPlayer = function (playerName, socket, socketid) {
        var self = this;
        this.jsonService.createPlayer(function (hand) {
            self.playerSubject.next({
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
    return PlayerHandler;
}());
exports.default = PlayerHandler;
