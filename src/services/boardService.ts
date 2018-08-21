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
        removeBoard(socketUrl: string): void;
    getBoardsInfo(): Array<BoardInfo>;
    getBoardInfo(socketUrl: string): BoardInfo;
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
            this.newBoard('Board 1', 3);
            this.newBoard('Board 2', 3);
            this.newBoard('Board 3', 3);
        }, 1000);
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

        this.boards.forEach((board) => {
            if (board.boardInfo.socketUrl === socketUrl) {
                board.updateBoardInfo(
                    Object.assign(board.boardInfo, {
                        name: newName,
                        playerLimit: newPlayerLimit,
                    })
                )
                board.socketHandler.emit('boardReset', null);
                board.reset;
            }
        });
    }
    removeBoard(socketUrl: string): void {
        this.boards.forEach((board: Board) => {
            if (board.boardInfo.socketUrl === socketUrl) {
                board.socketHandler.emit('boardReset', null);
                var playerKeys = Object.keys(board.getPlayers());
                playerKeys.forEach((playerId: string) => {
                board.removePlayer(playerId);
                board.boardInfo = null;
                this.boards.splice(this.boards.indexOf(board), 1);  
            });
            }
        })
    }
    getBoardInfo(socketUrl: string): BoardInfo {
        console.log(this.getBoardsInfo());
        return this.getBoardsInfo().find((boardInfo: BoardInfo) => {
            return boardInfo.socketUrl === socketUrl;
        })
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
