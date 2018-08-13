"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChatHandler = /** @class */ (function () {
    function ChatHandler(board, socketHandler) {
        this.socketHandler = socketHandler;
        this.board = board;
    }
    ChatHandler.prototype.onMessage = function (data, socketId) {
        this.socketHandler.emit('message', { from: this.board.getPlayerName(socketId), msg: data });
    };
    return ChatHandler;
}());
exports.default = ChatHandler;
