"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chatHandler_1 = require("../handlers/chatHandler");
var socketService = /** @class */ (function () {
    function socketService(board) {
        this.io = null;
        this.chatHandler = new chatHandler_1.default(board, this);
        this.board = board;
    }
    socketService.prototype.start = function (http) {
        this.io = require('socket.io')(http);
        this.io.on('connection', function (socket) {
            this.setupSocket(socket);
        });
    };
    socketService.prototype.emit = function (a, b) {
        this.io.emit(a, b);
    };
    socketService.prototype.setupSocket = function (socket) {
        this.board.joinedPlayer(socket.handshake.query.name, socket, socket.id);
        socket.on('sendMsg', function (data) {
            this.chatHandler.onMessage(data.msg, data.from);
        });
        socket.on('disconnect', function (reason) {
            console.log(socket.id + ' ' + reason);
            this.board.removePlayer(socket.id);
        });
        socket.on('startGame', function () {
            console.log('startGame Socket event');
            this.board.startGame();
        });
        socket.on('reset', function () {
            this.io.emit('boardReset', null);
            var players = Object.keys(this.board.getPlayers());
            for (var i in players) {
                this.board.removePlayer(players[i]);
            }
            this.board.reset();
        });
        socket.on('submission', function (card) {
            console.log(card + "submitted");
            console.log(this.board.submission(card));
        });
        socket.on('judgment', function (card) {
            this.board.judgement(card); // TODO why does this count as a submission
        });
    };
    return socketService;
}());
exports.default = socketService;
