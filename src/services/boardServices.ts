import {injectable} from "inversify";
import {BoardInfo, PLAYER_COUNT_LOWER_BOUND, PLAYER_COUNT_UPPER_BOUND} from "../models/boardModel";
import Board from "../board";
import * as uuid4 from 'uuid/v4'
import {container} from "../inversify.config";

export interface BoardInterface {
    newBoard(name: string, numberOfPlayers: number): boolean;

    removeBoard(socketUrl: string): void;

    getBoardsInfo(): Array<BoardInfo>;

    getBoardInfo(socketUrl: string): BoardInfo;

    getBoardInfoByName(name: string): BoardInfo;
}

export class BoardService implements BoardInterface {
    boards: Array<Board> = new Array<Board>();

    constructor() {
        this.newBoard('Board 1', 3);
        this.newBoard('Board 2', 3);
        this.newBoard('Board 3', 3);
    }

    getBoardInfo(socketUrl: string): BoardInfo {
        for (const board of this.boards) {
            if (board.info.socketUrl === socketUrl) {
                return board.info as BoardInfo;
            }
        }
        return null
    }

    getBoardInfoByName(name: string): BoardInfo {
        for (const board of this.boards) {
            if (board.info.name === name) {
                return board.info as BoardInfo;
            }
        }
        return null
    }

    getBoardsInfo(): Array<BoardInfo> {
        const boardInfoArray = [] as BoardInfo[];
        for (const board of this.boards) {
            boardInfoArray.push(board.info as BoardInfo)
        }
        return boardInfoArray;
    }

    newBoard(name: string, numberOfPlayers: number): boolean {
        // can't be empty
        if (!name || !(numberOfPlayers >= PLAYER_COUNT_LOWER_BOUND && numberOfPlayers <= PLAYER_COUNT_UPPER_BOUND)) {
            return false
        }

        let boards = this.getBoardsInfo();
        for (const board of boards) {
            if (board.name == name) {
                return false;
            }
        }
        const boardInfo = {
            name: name,
            playerLimit: numberOfPlayers,
            numberOfPlayers: 0,
            playerLimitReached: false,
            socketUrl: uuid4() //instance id is also the socket url
        } as BoardInfo;
        const boardInstance = container.resolve(Board);
        boardInstance.info = boardInfo;
        this.boards.push(boardInstance);
        boardInstance.startSocket();
        return true;
    }

    removeBoard(socketUrl: string): boolean {
        for (let i = 0; i < this.boards.length; i++) {
            if (this.boards[i].info.socketUrl === socketUrl) {
                this.boards.splice(i, 1);
                return true
            }
        }
        return false
    }
}

export default BoardService;
