import {BoardService} from "../../src/service/boardService";
import {} from "ts-jest"
import {container} from "../../src/inversify.config";
import {BoardInfo, PLAYER_COUNT_LOWER_BOUND, PLAYER_COUNT_UPPER_BOUND} from "../../src/interface/boardInterface";


describe('Unit tests on success', () => {
    it('board init test', () => {
        const boardService = new BoardService();
        const currentBoard = boardService.getBoardsInfo() as BoardInfo[];
        expect(currentBoard.length).toEqual(3);
        expect(currentBoard[0].name).toEqual('Board 1');
        expect(currentBoard[1].name).toEqual('Board 2');
        expect(currentBoard[2].name).toEqual('Board 3');
    });
    it('board info test', () => {
        const boardService = new BoardService();
        const currentBoard = boardService.getBoardsInfo() as BoardInfo[];
        expect(boardService.getBoardInfo(currentBoard[0].socketUrl).socketUrl).toEqual(currentBoard[0].socketUrl);
        expect(boardService.getBoardInfo(currentBoard[0].socketUrl).name).toEqual(currentBoard[0].name);
        expect(boardService.getBoardInfo(currentBoard[1].socketUrl).socketUrl).toEqual(currentBoard[1].socketUrl);
        expect(boardService.getBoardInfo(currentBoard[1].socketUrl).name).toEqual(currentBoard[1].name);
        expect(boardService.getBoardInfo(currentBoard[2].socketUrl).socketUrl).toEqual(currentBoard[2].socketUrl);
        expect(boardService.getBoardInfo(currentBoard[2].socketUrl).name).toEqual(currentBoard[2].name);
        expect(boardService.getBoardInfo('234')).toBeNull();
        expect(boardService.getBoardInfoByName('Board 1').socketUrl).toEqual(currentBoard[0].socketUrl);
        expect(boardService.getBoardInfoByName('Board 2314')).toBeNull();

    });
    it('board remove test', () => {
        const boardService = new BoardService();
        const currentBoard = boardService.getBoardsInfo() as BoardInfo[];
        expect(boardService.getBoardsInfo().length).toEqual(3);
        expect(boardService.removeBoard(currentBoard[0].socketUrl)).toEqual(true);
        expect(boardService.getBoardsInfo().length).toEqual(2);
        expect(boardService.getBoardInfo(currentBoard[0].socketUrl)).toBeNull();
        expect(boardService.removeBoard(currentBoard[0].socketUrl)).toEqual(false);
    });
    it('board add test', () => {
        const boardService = new BoardService();
        expect(boardService.getBoardsInfo().length).toEqual(3);
        expect(boardService.newBoard(boardService.getBoardsInfo()[0].name, 5)).toEqual(false);
        expect(boardService.getBoardsInfo().length).toEqual(3);
        expect(boardService.newBoard("123", PLAYER_COUNT_LOWER_BOUND - 1)).toEqual(false);
        expect(boardService.getBoardsInfo().length).toEqual(3);
        expect(boardService.newBoard("123", PLAYER_COUNT_UPPER_BOUND + 1)).toEqual(false);
        expect(boardService.getBoardsInfo().length).toEqual(3);
        expect(boardService.newBoard("123", 5)).toEqual(true);
        expect(boardService.getBoardsInfo().length).toEqual(4);
        expect(boardService.getBoardInfoByName("123")).toBeTruthy();
        expect(boardService.getBoardInfoByName("123").playerLimit).toBe(5);
        expect(boardService.getBoardInfoByName("123").numberOfPlayers).toBe(0);
        expect(boardService.getBoardInfoByName("123").playerLimitReached).toBeFalsy();
        expect(boardService.getBoardInfo(boardService.getBoardInfoByName("123").socketUrl)).toBeTruthy();
        expect(boardService.getBoardsInfo().length).toEqual(4);
    });
});