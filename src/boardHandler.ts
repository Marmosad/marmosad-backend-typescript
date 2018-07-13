import Board from './board';
import BoardInfo from './models/boardModel';
import app from '../app';

class BoardHandler {

    boards: Array<Board> = new Array<Board>();

    constructor() {
        this.newBoard('name1');
        this.newBoard('name2');
        this.newBoard('name3');
        this.newBoard('name4');
    }

    newBoard(name: string): Board {
        const boardInstance = new Board(name);
        this.boards.push(boardInstance);
        return boardInstance;
    }

    getBoardsInfo(): Array<BoardInfo>{
        let result = new Array<BoardInfo>();
        this.boards.forEach((board: Board) => {
            const data = new BoardInfo();
            data.name = board.name;
            data.numberOfPlayers = board.getPlayers.length;
            data.socketUrl = board.socketService.url;
            data.playerLimitReached = board.isLimitReached();
            result.push(data);
        });
        return result;
    }
} 

export default new BoardHandler()
