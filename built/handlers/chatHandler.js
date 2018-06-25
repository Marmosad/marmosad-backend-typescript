"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var board = require("../board.js");
var socketService = require();
var chatHandler = /** @class */ (function () {
    function chatHandler() {
    }
    chatHandler.prototype.onMessage = function (data, socketId) {
        socketService.emit('message', { from: board.getPlayerName(socketId), msg: data });
    };
    return chatHandler;
}());
exports.default = new chatHandler();
