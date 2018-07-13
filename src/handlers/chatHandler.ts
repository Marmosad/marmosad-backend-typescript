import Board from '../board.js'
import SocketService from '../dataServices/socketService'
class ChatHandler {
    private socketService;
    private board;
    constructor(board: Board, socketService: SocketService) {
        this.socketService = socketService;
        this.board = board;
    }

    onMessage (data, socketId) {
        this.socketService.emit('message', {from: this.board.getPlayerName(socketId), msg: data});
    }
}

export default ChatHandler;