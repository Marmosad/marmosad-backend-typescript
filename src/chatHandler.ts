import * as board '../board.js'
import * as socketService from ('../dataServices/socketService')
module.exports = {
    onMessage: function (data, socketId) {
        socketService.emit('message', {from: board.getPlayerName(socketId), msg: data});
    }
};