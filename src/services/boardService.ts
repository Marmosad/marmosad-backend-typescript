import Board from '../board';
import BoardInfo from '../models/boardModel';
import { interfaces, injectable, inject } from "inversify";
import { App, appInstance } from '../../app';
import { PlayerInterface } from '../services/playerService';
import { JsonInterface } from '../services/jsonService';
import { RxInterface } from '../services/rxService';
import { container } from '../services/containerService';
import { TYPES } from '../models/types';

export interface BoardInterface {
    newBoard(name: string, numberOfPlayers: number): Board;
    updateBoard(name: string, newPlayerLimit: number, newName: string): Board;
    removeBoard(name: string);
    getBoardsInfo(): Array<BoardInfo>;
}

@injectable()
export class BoardService implements BoardInterface{

    boards: Array<Board> = new Array<Board>();
    private playerService: PlayerInterface;
    private jsonService: JsonInterface;
    private rxService: RxInterface;

    constructor(
        @inject(TYPES.PlayerInterface) _playerService: PlayerInterface,
    ) {
        this.playerService = _playerService;
        this.jsonService = _playerService.jsonService;
        this.rxService = _playerService.rxService;
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
        boards.forEach((board) => {
            if (board.name === name) {
                repeating = true;
            }
        });
        if (repeating) {
            return null;
        } else {
            let boardInfo = new BoardInfo();
            boardInfo = {
                name: name,
                playerLimit: playerLimit,
                socketUrl: name,
                numberOfPlayers: 0,
                playerLimitReached: false
            }
            const boardInstance = new Board(boardInfo, appInstance, this.playerService, this.jsonService, this.rxService);        
            this.boards.push(boardInstance);
            return boardInstance;
        }
    }

    updateBoard(name: string, newPlayerLimit: number, newName: string): Board {

        let boards = this.getBoardsInfo();
        let repeating = false;
        boards.forEach((board) => {
            if (board.name === newName && name != newName) {
                repeating = true;
            }
        });
        if (repeating) {
            return null;
        };

        boards.forEach((board) => {
            if (board.name === name) {
                this.removeBoard(board.name);
                boards.splice(boards.indexOf(board),1);
            }
        });

        let boardInstance = this.newBoard(newName, newPlayerLimit);
        return boardInstance;
    }

    removeBoard(name: string) {
        
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
