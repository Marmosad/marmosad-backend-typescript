"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var board_js_1 = require("../board.js");
var socketService_1 = require("../dataServices/socketService");
var chatHandler = /** @class */ (function () {
    function chatHandler() {
    }
    chatHandler.prototype.onMessage = function (data, socketId) {
        socketService_1.default.emit('message', { from: board_js_1.default.getPlayerName(socketId), msg: data });
    };
    return chatHandler;
}());
exports.default = new chatHandler();
