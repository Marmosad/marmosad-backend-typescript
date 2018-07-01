import board from '../board.js'
import socketService from '../dataServices/socketService'
class chatHandler {
    private socketService;
    private board;
    constructor(board: board, socketService: socketService) {
        this.socketService = socketService;
        this.board = board;
    }

    onMessage (data, socketId) {
        this.socketService.emit('message', {from: this.board.getPlayerName(socketId), msg: data});
    }
}

export default chatHandler;