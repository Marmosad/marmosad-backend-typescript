import * as board from '../board.js'
import * as socketService from ('../dataServices/socketService')
class chatHandler {
    onMessage (data, socketId) {
        socketService.emit('message', {from: board.getPlayerName(socketId), msg: data});
    }
}

export default new chatHandler();