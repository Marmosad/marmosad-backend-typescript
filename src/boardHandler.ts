import board from './board';
import BoardInfo from './models/boardModel';

class boardHandler {

    boards: Array<board> = new Array<board>();

    constructor() {
        this.newBoard('name1');
        this.newBoard('name2');
        this.newBoard('name3');
        this.newBoard('name4');
    }

    newBoard(name: string): board {
        const boardInstance = new board(name);
        this.boards.push(boardInstance);
        return boardInstance;
    }

    getBoardsInfo(): Array<BoardInfo>{
        let result = new Array<BoardInfo>();
        this.boards.forEach((board: board) => {
            const data = new BoardInfo();
            data.name = board.name;
            data.numberOfPlayers = board.getPlayers.length;
            data.playerLimitReached = board.isLimitReached();
            data.socketUrl = board.socketService.url;
            result.push(data);
        });
        return result;
    }
} 

export default new boardHandler()
