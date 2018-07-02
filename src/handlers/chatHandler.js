"use strict";
exports.__esModule = true;
var chatHandler = /** @class */ (function () {
    function chatHandler(board, socketService) {
        this.socketService = socketService;
        this.board = board;
    }
    chatHandler.prototype.onMessage = function (data, socketId) {
        this.socketService.emit('message', { from: this.board.getPlayerName(socketId), msg: data });
    };
    return chatHandler;
}());
exports["default"] = chatHandler;
