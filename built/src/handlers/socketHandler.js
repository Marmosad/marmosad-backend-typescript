"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var handlers_1 = require("../barrels/handlers");
var SocketHandler = /** @class */ (function () {
    function SocketHandler(board) {
        this.io = null;
        this._url = '';
        board.boardInfo.socketUrl = '/' + board.boardInfo.instanceId.getTime();
        this.url = board.boardInfo.socketUrl;
        this.chatHandler = new handlers_1.ChatHandler(board, this);
        this.board = board;
    }
    SocketHandler.prototype.start = function (http) {
        var self = this;
        this.io = require('socket.io')(http, { path: this.url });
        this.io.on('connection', function (socket) {
            self.setupSocket(socket);
        });
    };
    SocketHandler.prototype.emit = function (a, b) {
        this.io.emit(a, b);
    };
    SocketHandler.prototype.setupSocket = function (socket) {
        var self = this;
        this.board.joinedPlayer(socket.handshake.query.name, socket, socket.id);
        socket.on('sendMsg', function (data) {
            console.log(self.io.client);
            self.chatHandler.onMessage(data.msg, data.from);
        });
        socket.on('disconnect', function (reason) {
            // console.log(socket.id + ' ' + reason);
            self.board.removePlayer(socket.id);
        });
        socket.on('startGame', function () {
            console.log('startGame Socket event');
            console.log(self.io.client);
            self.board.startGame();
        });
        socket.on('reset', function () {
            self.io.emit('boardReset', null);
            var playerKeys = Object.keys(self.board.getPlayers());
            playerKeys.forEach(function (playerId) {
                self.board.removePlayer(playerId);
            });
            self.board.reset();
        });
        socket.on('submission', function (card) {
            // console.log(card + "submitted");
            // console.log(self.board.submission(card));
        });
        socket.on('judgment', function (card) {
            self.board.judgement(card); // TODO why does this count as a submission
        });
    };
    Object.defineProperty(SocketHandler.prototype, "url", {
        get: function () {
            return this._url;
        },
        set: function (url) {
            this._url = url;
        },
        enumerable: true,
        configurable: true
    });
    return SocketHandler;
}());
exports.default = SocketHandler;
