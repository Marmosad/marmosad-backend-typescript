import Board from '../board';
import BoardInfo from '../models/boardModel';
import { App } from '../../app';

class BoardHandler {

    private app: App;
    boards: Array<Board> = new Array<Board>();

    constructor(app: App) {
        this.app = app;
        this.newBoard('name1');
        this.newBoard('name2');
        this.newBoard('name3');
        this.newBoard('name4');
    }

    newBoard(name: string): Board {
        const boardInstance = new Board(name, this.app);
        this.boards.push(boardInstance);
        return boardInstance;
    }

    getBoardsInfo(): Array<BoardInfo>{
        let result = new Array<BoardInfo>();
        this.boards.forEach((board: Board) => {
            const data = new BoardInfo();
            data.name = board.name;
            data.numberOfPlayers = board.getPlayers.length;
            data.socketUrl = board.socketHandler.url;
            data.playerLimitReached = board.isLimitReached();
            result.push(data);
        });
        return result;
    }
} 

export default BoardHandler;
