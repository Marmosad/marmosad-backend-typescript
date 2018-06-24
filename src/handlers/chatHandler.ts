import board = require('../board.js');
import socketService = require('../dataServices/socketService');
module.exports = {
    onMessage: function (data, socketId) {
        socketService.emit('message', {from: board.getPlayerName(socketId), msg: data});
    }
};