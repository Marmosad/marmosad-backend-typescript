import * as board '../board.js'
import * as socketService from ('../dataServices/socketService')
export class chatHandler {
    onMessage (data, socketId) {
        socketService.emit('message', {from: board.getPlayerName(socketId), msg: data});
    }
}