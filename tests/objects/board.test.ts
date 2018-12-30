import {container} from "../../src/inversify.config";
import * as uuid4 from 'uuid/v4'
import Board from "../../src/object/board";
import {BoardInfo} from "../../src/object/boardComponent";
import {ConnectionEvent, SubmissionEvent} from "../../src/interface/rxEventInterface";

import * as jest from "ts-jest"
import {random} from "../../src/util";
import {DealtCard} from "../../src/interface/playerInterface";
import {Player} from "../../src/object/player";

console.log('Testing on jest ' + jest.version);

const boardInfo = {
    boardName: 'testBoard',
    playerLimit: 6,
    numberOfPlayers: 0,
    playerLimitReached: false,
    socketUrl: uuid4() //instance id is also the socket url
} as BoardInfo;

describe('Board tests', () => {
    let boardInstance: Board;
    beforeEach(async () => {
        boardInstance = container.resolve(Board);
        boardInstance.info = JSON.parse(JSON.stringify(boardInfo));
        boardInstance.startSocket();
        boardInstance.startEventHandler();
        await boardInstance.initDeck(['room-309']);
    });

    it(
        'should initialize board correctly', function () {
            expect(boardInstance.info.boardName).toEqual(boardInfo.boardName);
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
        console.log(boardInstance.getPlayer("1"));
        expect(boardInstance.getPlayer("1").hand.length).toEqual(7);
        expect(boardInstance.getPlayer("1").socketUrl).toEqual("234");
        expect(boardInstance.getPlayer("1").isJudge).toEqual(false);
        expect(boardInstance.getPlayer("1").playerName).toEqual("1");
        expect(boardInstance.getPlayer("1").score).toEqual(0);
    }, 20000);
});

describe("Board actions test", () => {
    let boardInstance: Board;
    beforeEach(async () => {
        boardInstance = null;
        boardInstance = container.resolve(Board);
        boardInstance.info = JSON.parse(JSON.stringify(boardInfo)); // deep copy! :')
        boardInstance.startSocket();
        boardInstance.startEventHandler();
        await boardInstance.initDeck(['room-309']);
    });
    it('should add player on connection', async () => {
        await boardInstance.playerConnect({playerName: 'bob', socketUrl: 'somerandomshit1'});
        await boardInstance.playerConnect({playerName: 'jim', socketUrl: 'somerandomshit2'});
        await boardInstance.playerConnect({playerName: 'kurt', socketUrl: 'somerandomshit3'});
        expect(boardInstance.getPlayer('bob').playerName).toEqual('bob');
        expect(boardInstance.getPlayer('bob').hand.length).toEqual(7);
        expect(boardInstance.getPlayer('bob').isJudge).toEqual(false);
        expect(boardInstance.getPlayer('bob').score).toEqual(0);
        expect(boardInstance.getPlayer('bob').socketUrl).toEqual('somerandomshit1');

        expect(boardInstance.getPlayer('jim').playerName).toEqual('jim');
        expect(boardInstance.getPlayer('jim').hand.length).toEqual(7);
        expect(boardInstance.getPlayer('jim').isJudge).toEqual(false);
        expect(boardInstance.getPlayer('jim').score).toEqual(0);
        expect(boardInstance.getPlayer('jim').socketUrl).toEqual('somerandomshit2');

        expect(boardInstance.getPlayer('kurt').playerName).toEqual('kurt');
        expect(boardInstance.getPlayer('kurt').hand.length).toEqual(7);
        expect(boardInstance.getPlayer('kurt').isJudge).toEqual(false);
        expect(boardInstance.getPlayer('kurt').score).toEqual(0);
        expect(boardInstance.getPlayer('kurt').socketUrl).toEqual('somerandomshit3');

        expect(boardInstance.players.size).toEqual(3);
        expect(boardInstance.info.numberOfPlayers).toEqual(3);

    }, 20000);

    it('should remove player on disconnect', async () => {
        await boardInstance.playerConnect({playerName: 'bob', socketUrl: 'somerandomshit1'});
        await boardInstance.playerConnect({playerName: 'jim', socketUrl: 'somerandomshit2'});
        await boardInstance.playerConnect({playerName: 'kurt', socketUrl: 'somerandomshit3'});
        boardInstance.playerDisconnect({playerName: 'kurt', socketUrl: 'somerandomshit3'});
        expect(boardInstance.players.size).toEqual(2);
        expect(boardInstance.info.numberOfPlayers).toEqual(2);
        // removed correct guy?
        expect(boardInstance.getPlayer('kurt')).toBeFalsy();
        expect(boardInstance.getPlayer('bob')).toBeTruthy();
        expect(boardInstance.getPlayer('jim')).toBeTruthy();
        // don't remove someone who doesn't exist
        boardInstance.playerDisconnect({playerName: 'kurt', socketUrl: 'somerandomshit3'});
        expect(boardInstance.players.size).toEqual(2);
        expect(boardInstance.info.numberOfPlayers).toEqual(2);
        expect(boardInstance.getPlayer('bob')).toBeTruthy();
        expect(boardInstance.getPlayer('jim')).toBeTruthy();

        boardInstance.playerDisconnect({playerName: 'bob', socketUrl: 'somerandomshit1'});
        boardInstance.playerDisconnect({playerName: 'jim', socketUrl: 'somerandomshit2'});
        expect(boardInstance.players.size).toEqual(0);
        expect(boardInstance.info.numberOfPlayers).toEqual(0);
    }, 20000);

    it('should play white card only when valid', async () => {
        await boardInstance.playerConnect({playerName: 'bob', socketUrl: 'somerandomshit1'});
        expect(boardInstance.display.submissions.length).toBe(0);
        // can't play as judge
        boardInstance.display.currentJudge = 'bob';
        boardInstance.playWhiteCard({
            card: boardInstance.getPlayer('bob').hand.pop() as DealtCard,
            cardPack: "room-309",
            playerName: "bob",
            socketUrl: "ksd2d"
        } as SubmissionEvent);
        expect(boardInstance.display.submissions.length).toBe(0);
        // can play when not judge
        boardInstance.display.currentJudge = 'notbob';
        boardInstance.playWhiteCard({
            card: boardInstance.getPlayer('bob').hand.pop() as DealtCard,
            cardPack: "room-309",
            playerName: "bob",
            socketUrl: "ksd2d"
        } as SubmissionEvent);
        expect(boardInstance.display.submissions.length).toBe(1);
        // can't play twice
        boardInstance.playWhiteCard({
            card: boardInstance.getPlayer('bob').hand.pop() as DealtCard,
            cardPack: "room-309",
            playerName: "bob",
            socketUrl: "ksd2d"
        } as SubmissionEvent);
        expect(boardInstance.display.submissions.length).toBe(1);
    }, 20000);
    it('should deal cards for a fresh board', async function () {
        boardInstance.players.set('a', new Player('a', ''));
        boardInstance.players.set('b', new Player('b', ''));
        boardInstance.players.set('c', new Player('c', ''));
        boardInstance.players.set('d', new Player('d', ''));
        boardInstance.players.set('e', new Player('e', ''));
        boardInstance.info.numberOfPlayers = 5;
        await boardInstance.dealNewCards();
        expect(boardInstance.display.currentJudge).toBeTruthy();
        expect(boardInstance.display.blackCard.cardId).toBeGreaterThan(0);
        expect(boardInstance.display.submissions).toEqual([]);
        boardInstance.players.forEach(value => {
            expect(value.hasPlayed).toEqual(false);
        })
    }, 20000);
});

describe("Board actions test, no deck", () => {
    let boardInstance: Board;
    beforeEach(async () => {
        boardInstance = null;
        boardInstance = container.resolve(Board);
        boardInstance.info = JSON.parse(JSON.stringify(boardInfo)); // deep copy! :')
        boardInstance.startSocket();
        boardInstance.startEventHandler();
    });

    it('should select next judge properly', async () => {
        boardInstance.players.set('a', new Player('a', ''));
        boardInstance.players.set('b', new Player('b', ''));
        boardInstance.players.set('c', new Player('c', ''));
        boardInstance.players.set('d', new Player('d', ''));
        boardInstance.players.set('e', new Player('e', ''));
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('a');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('b');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('c');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('d');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('e');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('a');
        // check behavior on player leave
        boardInstance.players.delete('c');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('b');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('d');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('e');
        boardInstance.display.currentJudge = boardInstance.selectNextJudge();
        expect(boardInstance.display.currentJudge).toEqual('a');
    });

    it('should convert Card to DealtCard', function () {
        const rand = random(1, 100);
        const bod = 'A particular bod';
        const own = 'ownername';
        expect(Board.dealCard({cardId: rand, body: bod}, own).owner).toEqual(own);
        expect(Board.dealCard({cardId: rand, body: bod}, own).cardId).toEqual(rand);
        expect(Board.dealCard({cardId: rand, body: bod}, own).body).toEqual(bod);
    });
});
