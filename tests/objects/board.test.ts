import {container} from "../../src/inversify.config";
import * as uuid4 from 'uuid/v4'
import Board from "../../src/object/board";
import {BoardInfo} from "../../src/object/boardComponent";
import {ConnectionEvent} from "../../src/interface/rxEventInterface";

import * as jest from "ts-jest"

console.log('Testing on jest ' + jest.version);

const boardInfo = {
    name: 'testBoard',
    playerLimit: 6,
    numberOfPlayers: 0,
    playerLimitReached: false,
    socketUrl: uuid4() //instance id is also the socket url
} as BoardInfo;

describe('Board tests', () => {
    let boardInstance: Board;
    beforeEach(async () => {
        boardInstance = container.resolve(Board);
        boardInstance.info = boardInfo;
        boardInstance.startSocket();
        boardInstance.startEventHandler();
        await boardInstance.initDeck(['room-309']);
    });

    it('should initialize board correctly', function () {
        expect(boardInstance.info.name).toEqual(boardInfo.name);
        expect(boardInstance.info.playerLimit).toEqual(boardInfo.playerLimit);
        expect(boardInstance.info.numberOfPlayers).toEqual(boardInfo.numberOfPlayers);
        expect(boardInstance.info.playerLimitReached).toEqual(boardInfo.playerLimitReached);
        expect(boardInstance.info.socketUrl).toEqual(boardInfo.socketUrl);
    });

    it('should handle player connection correctly', async function () {
        await boardInstance.playerConnect({
            playerName: "1",
            socketUrl: "234",
        } as ConnectionEvent);
        setTimeout(()=> { // we wanna wait to see if there's overfill with our hand.
            console.log(boardInstance.getPlayer("1"));
            expect(boardInstance.getPlayer("1").hand.length).toEqual(7);
            expect(boardInstance.getPlayer("1").socketUrl).toEqual("234");
            expect(boardInstance.getPlayer("1").isJudge).toEqual(false);
            expect(boardInstance.getPlayer("1").playerName).toEqual("1");
            expect(boardInstance.getPlayer("1").score).toEqual(0);
        }, 2000)
    });

});