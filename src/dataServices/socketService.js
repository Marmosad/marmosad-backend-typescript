"use strict";
exports.__esModule = true;
var io = null;
var socketService = /** @class */ (function () {
    function socketService() {
    }
    socketService.prototype.start = function (http) {
        io = require('socket.io')(http);
        io.on('connection', function (socket) {
            setupSocket(socket);
        });
    };
    socketService.prototype.emit = function (a, b) {
        io.emit(a, b);
    };
    return socketService;
}());
function setupSocket(socket) {
    var chatHandler = require('../handlers/chatHandler');
    var board = require('../board');
    board.joinedPlayer(socket.handshake.query.name, socket, socket.id);
    socket.on('sendMsg', function (data) {
        chatHandler.onMessage(data.msg, data.from);
    });
    socket.on('disconnect', function (reason) {
        console.log(socket.id + ' ' + reason);
        board.removePlayer(socket.id);
    });
    socket.on('startGame', function () {
        console.log('startGame Socket event');
        board.startGame();
    });
    socket.on('reset', function () {
        io.emit('boardReset', null);
        var players = Object.keys(board.getPlayers());
        for (var i in players) {
            board.removePlayer(players[i]);
        }
        board.reset();
    });
    socket.on('submission', function (card) {
        console.log(card + "submitted");
        console.log(board.submission(card));
    });
    socket.on('judgment', function (card) {
        board.judgement(card); // TODO why does this count as a submission
    });
}
exports["default"] = new socketService();
