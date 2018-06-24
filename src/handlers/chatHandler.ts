import board = require('../board.js');
import socketService = require('../dataServices/socketService');
export class chatHandler {
    onMessage (data, socketId) {
        socketService.emit('message', {from: board.getPlayerName(socketId), msg: data});
    }
}