import Board from '../board';
import BoardInfo from '../models/boardModel';
import { interfaces, injectable, inject } from "inversify";
import { App } from '../../app';
import { PlayerInterface } from '../services/playerService';
import { JsonInterface } from '../services/jsonService';
import { RxInterface } from '../services/rxService';
import { container } from '../services/containerService';
import { TYPES } from '../models/types';

export interface BoardInterface {
    newBoard(name): Board;
    getBoardsInfo(): Array<BoardInfo>;
}

@injectable()
export class BoardService implements BoardInterface{

    private app: App;
    boards: Array<Board> = new Array<Board>();
    private playerService: PlayerInterface;
    private jsonService: JsonInterface;
    private rxService: RxInterface;

    constructor(
        @inject(TYPES.PlayerInterface) _playerService: PlayerInterface,
        @inject(TYPES.JsonInterface) _jsonService: JsonInterface,
        @inject(TYPES.RxInterface) _rxService: RxInterface,
    ) {
        this.app = app;
        this.playerService = _playerService;
        this.jsonService = _jsonService;
        this.rxService = _rxService;
        this.newBoard('name1');
        this.newBoard('name2');
        this.newBoard('name3');
        this.newBoard('name4');
    }

    newBoard(name: string): Board {
        const boardInstance = new Board(name, this.app, this.playerService, this.jsonService, this.rxService);
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

export default BoardService;
