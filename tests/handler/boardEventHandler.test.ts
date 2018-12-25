import {BoardEventHandler} from "../../src/handler/boardEventHandler";
import {
    ConnectionEvent,
    JudgementEvent,
    RxEvents,
    RxEventsInterface,
    SubmissionEvent
} from "../../src/interface/rxEventInterface";
import {State} from "../../src/interface/boardInterface";
import * as jest from "ts-jest"
import {Card} from "../../src/interface/firestoreInterface";

console.log('Testing on jest ' + jest.version);


const boardEventHandler = new BoardEventHandler();

describe('Board event handler connection events tests', () => {
    it('start game events player connect', (done) => {
        boardEventHandler.gameState = State.startGame;

        boardEventHandler.subscribe((next: RxEventsInterface) => {
            expect(next.event).toEqual(RxEvents.playerConnect);
            expect(next.eventData.socketUrl).toEqual("234");
            expect(next.eventData.playerName).toEqual("1");
            done()
        });
        boardEventHandler.emitEvent({
            event: RxEvents.playerConnect,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface)
    });
    it('start game events player disconnect', (done) => {
        boardEventHandler.gameState = State.startGame;

        boardEventHandler.subscribe((next: RxEventsInterface) => {
            expect(next.event).toEqual(RxEvents.playerDisconnect);
            expect(next.eventData.socketUrl).toEqual("234");
            expect(next.eventData.playerName).toEqual("1");
            done()
        });
        boardEventHandler.emitEvent({
            event: RxEvents.playerDisconnect,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface)
    });
    it('start game events player connect reject wrong event', (done) => {
        boardEventHandler.gameState = State.startGame;

        boardEventHandler.subscribe((next: RxEventsInterface) => {
            expect(next.event).toEqual(RxEvents.playerConnect);
            expect(next.eventData.socketUrl).toEqual("234");
            expect(next.eventData.playerName).toEqual("1");
            done()
        });

        boardEventHandler.emitEvent({
            event: RxEvents.playedWhiteCard,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.judgedSubmission,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.playerConnect,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface);
    });
    it('start game events player disconnect reject wrong event', (done) => {
        boardEventHandler.gameState = State.startGame;

        boardEventHandler.subscribe((next: RxEventsInterface) => {
            expect(next.event).toEqual(RxEvents.playerDisconnect);
            expect(next.eventData.socketUrl).toEqual("234");
            expect(next.eventData.playerName).toEqual("1");
            done()
        });

        boardEventHandler.emitEvent({
            event: RxEvents.playedWhiteCard,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.judgedSubmission,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.playerDisconnect,
            eventData: {playerName: "1", socketUrl: "234"} as ConnectionEvent
        } as RxEventsInterface);
    });
});


describe('Board event handler game events tests', () => {
    it('should accept only submissions events', (done) => {
        boardEventHandler.gameState = State.submission;

        boardEventHandler.subscribe((next: RxEventsInterface) => {
            expect(next.event).toEqual(RxEvents.playedWhiteCard);
            const eventData = next.eventData as SubmissionEvent;
            expect(eventData.socketUrl).toEqual("234");
            expect(eventData.playerName).toEqual("1");
            expect(eventData.cardPack).toEqual("test-cards");
            expect(eventData.card.cardId).toEqual(22);
            expect(eventData.card.body).toEqual("test");
            done()
        });
        boardEventHandler.emitEvent({
            event: RxEvents.playerConnect,
            eventData: {
                playerName: "1",
                socketUrl: "234",
                cardPack: 'test-cards',
                card: {cardId: 22, body: "test"} as Card
            } as SubmissionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.judgedSubmission,
            eventData: {
                playerName: "1",
                socketUrl: "234",
                cardPack: 'test-cards',
                card: {cardId: 22, body: "test"} as Card
            } as SubmissionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.playedWhiteCard,
            eventData: {
                playerName: "1",
                socketUrl: "234",
                cardPack: 'test-cards',
                card: {cardId: 22, body: "test"} as Card
            } as SubmissionEvent
        } as RxEventsInterface)
    });

    it('should accept only judgement events', (done) => {
        boardEventHandler.gameState = State.judgement;

        boardEventHandler.subscribe((next: RxEventsInterface) => {
            expect(next.event).toEqual(RxEvents.judgedSubmission);
            const eventData = next.eventData as JudgementEvent;
            expect(eventData.socketUrl).toEqual("234");
            expect(eventData.playerName).toEqual("1");
            expect(eventData.cardPack).toEqual("test-cards");
            expect(eventData.card.cardId).toEqual(22);
            expect(eventData.card.body).toEqual("test");
            done()
        });
        boardEventHandler.emitEvent({
            event: RxEvents.playerConnect,
            eventData: {
                playerName: "1",
                socketUrl: "234",
            } as ConnectionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.playedWhiteCard,
            eventData: {
                playerName: "1",
                socketUrl: "234",
                cardPack: 'test-cards',
                card: {cardId: 22, body: "test"} as Card
            } as SubmissionEvent
        } as RxEventsInterface);
        boardEventHandler.emitEvent({
            event: RxEvents.judgedSubmission,
            eventData: {
                playerName: "1",
                socketUrl: "234",
                owner: 'wenyuge',
                ownerUrl: '123asdDFQ#@',
                cardPack: 'test-cards',
                card: {cardId: 22, body: "test"} as Card
            } as JudgementEvent
        } as RxEventsInterface)
    });
});