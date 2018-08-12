import Board from '../board';
import { BoardInfo } from '../models/boardModel';
import { interfaces, injectable, inject } from "inversify";
import { App, appInstance } from '../../app';
import { JsonInterface } from '../services/jsonService';
import { container } from '../services/containerService';
import { TYPES } from '../models/types';

export interface BoardInterface {
    newBoard(name: string, numberOfPlayers: number): Board;
    updateBoard(name: string, newPlayerLimit: number, newName: string): void;
    getBoardsInfo(): Array<BoardInfo>;
}

@injectable()
export class BoardService implements BoardInterface{

    boards: Array<Board> = new Array<Board>();
    private jsonService: JsonInterface;

    constructor(
        @inject(TYPES.JsonInterface) _jsonService: JsonInterface,
    ) {
        this.jsonService = _jsonService;
        setTimeout(() => {
            this.newBoard('name1', 5);
            this.newBoard('name2', 5);
            this.newBoard('name3', 5);
            this.newBoard('name4', 5);
        }, 2000);
    }

    newBoard(name: string, playerLimit: number): Board {
        let boards = this.getBoardsInfo();
        let repeating = false;
        const boardInfo = Object.assign(new BoardInfo(), {
            name: name,
            playerLimit: playerLimit,
            socketUrl: name,
            numberOfPlayers: 0,
            playerLimitReached: false
        })
        const boardInstance = new Board(boardInfo, appInstance, this.jsonService);        
        this.boards.push(boardInstance);
        return boardInstance;
    }

    updateBoard(socketUrl: string, newPlayerLimit: number, newName: string): void {

        let boards = this.boards;

        boards.forEach((board) => {
            if (board.boardInfo.socketUrl === socketUrl) {
                board.boardInfo.name = newName;
                board.boardInfo.playerLimit = newPlayerLimit;
            }
        });
    }

    getBoardsInfo(): Array<BoardInfo>{
        let result = new Array<BoardInfo>();
        this.boards.forEach((board: Board) => {
            const data = board.boardInfo;
            result.push(data);
        });
        return result;
    }


} 

export default BoardService;