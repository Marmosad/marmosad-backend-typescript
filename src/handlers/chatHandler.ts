import Board from '../board.js';
import {SocketHandler} from '../barrels/handlers';

export default class ChatHandler {
    private socketHandler;
    private board;
    constructor(board: Board, socketHandler: SocketHandler) {
        this.socketHandler = socketHandler;
        this.board = board;
    }

    onMessage (data, socketId) {
        this.socketHandler.emit('message', {from: this.board.getPlayerName(socketId), msg: data});
    }
}