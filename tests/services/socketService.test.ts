import {container} from "../../src/config/inversify.config";
import {SocketService} from "../../src/service/socketService";
import * as jest from "ts-jest"
import {Http} from "../../src/service/httpSingletonService";
import * as io_client from "socket.io-client"
import {Chat} from "../../src/interface/socketInterface";
import {BoardEventHandler} from "../../src/handler/boardEventHandler";
import {State} from "../../src/interface/boardInterface";
import {JudgementEvent, RxEvents, RxEventsInterface, SubmissionEvent} from "../../src/interface/rxEventInterface";
import {DealtCard} from "../../src/interface/playerInterface";
import {PORT} from "../../src/config/config";

console.log('Testing on jest ' + jest.version);

const HTTP_ROOT = 'http://localhost:' + PORT + '/';
let socketA: SocketService;
let client1;
let client2;
let client3;
let client4;
let http;
describe('Socket service connect test', () => {
    afterEach(async () => {
        await socketA.stop();
        if (client1) {
            client1.disconnect();
        }
        if (client2) {
            client2.disconnect();
        }
        http.close();
    });
    it('should connect', done => {
            container.get<Http>(Http).httpStart().then(() => {
                http = container.get<Http>(Http).httpServer;
                socketA = container.resolve(SocketService);
                socketA.start('/a', null);
                socketA.io.on('connection', function (socket: any) {
                    console.log('[TEST EVENT] Player: ' + socket.handshake.query.playerName + ' joined.');
                    expect(socket.handshake.query.playerName).toEqual('1');
                    done()
                });
                console.log(container.get(Http).port);
                client1 = io_client(HTTP_ROOT, {
                    query: 'playerName=' + "1",
                    path: '/a'
                });
            })
        }
    );
    it('should add connection test', (done) => {
            const name = "1";
            container.get<Http>(Http).httpStart().then(() => {
                http = container.get<Http>(Http).httpServer;
                socketA = container.resolve(SocketService);
                socketA.start('/a', null);
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'playerName=' + name,
                    path: '/a'
                });
                socketA.io.on('connection', function (socket: any) {
                    console.log('[TEST EVENT] Player: ' + socket.handshake.query.playerName + ' joined.');
                    expect(socketA.getConnection(name).handshake.query.playerName).toEqual(name);
                    http.close();
                    done()
                });
            })
        }
    );
});


describe('Socket service disconnect test', () => {
    const name = "1";
    beforeEach((done) => {
        container.get<Http>(Http).httpStart().then(() => {
            http = container.get<Http>(Http).httpServer;
            socketA = container.resolve(SocketService);
            socketA.start('/a', null);
            console.log(HTTP_ROOT);
            client1 = io_client(HTTP_ROOT, {
                query: 'playerName=' + name,
                path: '/a'
            });
            socketA.io.on('connection', function (socket: any) {
                console.log('[TEST EVENT] Player: ' + socket.handshake.query.playerName + ' joined.');
                expect(socketA.getConnection(name).handshake.query.playerName).toEqual(name);
                done();
            });
        })
    });
    afterEach(async() => {
        await socketA.stop();
        if (client1) {
            client1.disconnect();
        }
        if (client2) {
            client2.disconnect();
        }
        http.close();
    });
    it('should remove connection test via kill', (done) => {
            client1.emit('kill', 'testing end socket event');
            // Soft disconnects from client side doesn't kill the socket immediately, so we use the kill event
            // a more costly way to kill the socket is socket.disconnect() which takes ~60s to register
            setTimeout(() => {
                expect(socketA.getConnection(name)).toBeUndefined();
                done()
            }, 2000);
        }
    );
    it('should remove connection test', (done) => {
            client1.close();
            // this takes a long ass time :') socket.io's limitations not ours.
            setTimeout(() => {
                expect(socketA.getConnection(name)).toBeUndefined();
                done()
            }, 7000); // ping
        }, 60000
    );
});

describe('Socket chat test', () => {
    afterEach(async () => {
        await socketA.stop();
        if (client1) {
            client1.disconnect();
        }
        if (client2) {
            client2.disconnect();
        }
        if (client3) {
            client3.disconnect();
        }
        if (client2) {
            client4.disconnect();
        }
        http.close()
    });


    it('should receive message', (done) => {
            container.get<Http>(Http).httpStart().then(() => {
                let receivedMsg = 0;
                const chatmsg = 'ni hao';
                http = container.get<Http>(Http).httpServer;
                socketA = container.resolve(SocketService);
                socketA.start('/a', null);
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'playerName=' + '1',
                    path: '/a'
                }).on('chat', (chat) => {
                    console.log(chat);
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;

                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client2 = io_client(HTTP_ROOT, {
                    query: 'playerName' +
                        '=' + '2',
                    path: '/a'
                }).on('chat', (chat: Chat) => {
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;
                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client3 = io_client(HTTP_ROOT, {
                    query: 'playerName' +
                        '=' + '3',
                    path: '/a'
                }).on('chat', (chat: Chat) => {
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;
                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client4 = io_client(HTTP_ROOT, {
                    query: 'playerName' +
                        '=' + '4',
                    path: '/a'
                }).on('chat', (chat: Chat) => {
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;
                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client1.emit('chat', chatmsg)
            })
        }
    );

    it('should ignore empty', (done) => {
            container.get<Http>(Http).httpStart().then(() => {
                let receivedMsg = 0;
                const chatmsg = 'ni hao';
                http = container.get<Http>(Http).httpServer;
                socketA = container.resolve(SocketService);
                socketA.start('/a', null);
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'playerName' +
                        '=' + '1',
                    path: '/a'
                }).on('chat', (chat) => {
                    console.log(chat);
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;

                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client2 = io_client(HTTP_ROOT, {
                    query: 'playerName' +
                        '=' + '2',
                    path: '/a'
                }).on('chat', (chat: Chat) => {
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;
                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client3 = io_client(HTTP_ROOT, {
                    query: 'playerName' +
                        '=' + '3',
                    path: '/a'
                }).on('chat', (chat: Chat) => {
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;
                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client4 = io_client(HTTP_ROOT, {
                    query: 'playerName' +
                        '=' + '4',
                    path: '/a'
                }).on('chat', (chat: Chat) => {
                    expect(chat.msg).toEqual(chatmsg);
                    expect(chat.from).toEqual('1');
                    receivedMsg++;
                    if (receivedMsg >= 4) {
                        done()
                    }
                });
                client1.emit('chat', '');
                client1.emit('chat', '                ');
                client1.emit('chat', chatmsg)
            });
        }
    );
});

describe("Event Handler Tests", () => {
    let boardEventHandler: BoardEventHandler;

    afterEach(async () => {
        await socketA.stop();
        if (client1) {
            client1.disconnect();
        }
        if (client2) {
            client2.disconnect();
        }
        if (client3) {
            client3.disconnect();
        }
        if (client2) {
            client4.disconnect();
        }
        http.close();
    });

    beforeEach(async () => {
        boardEventHandler = new BoardEventHandler();
        await container.get<Http>(Http).httpStart();
        http = container.get<Http>(Http).httpServer;
        socketA = container.resolve(SocketService);
        socketA.start('/test', boardEventHandler.emitEvent);
    });
    it('should emit submission to event handler', function (done) {
        boardEventHandler.gameState = State.submission;
        const temp = boardEventHandler.subscribe(async (next: RxEventsInterface)=>{
            expect(next.event).toEqual(RxEvents.playedWhiteCard);
            expect(next.eventData.playerName).toEqual('1');
            expect((next.eventData as SubmissionEvent).card.body).toEqual('test');
            expect((next.eventData as SubmissionEvent).card.owner).toEqual('test');
            expect((next.eventData as SubmissionEvent).card.cardId).toEqual(0);
            temp.unsubscribe();
            done();
        });
        client1 = io_client(HTTP_ROOT, {
            query: 'playerName' +
                '=' + '1',
            path: '/test'
        });
        client1.emit('submission', {body: "test", cardId: 0, owner: "test"} as DealtCard)
    });
    it('should emit judgment to event handler', function (done) {
        boardEventHandler.gameState = State.judgment;
        const temp = boardEventHandler.subscribe(async (next: RxEventsInterface)=>{
            expect(next.event).toEqual(RxEvents.judgedSubmission);
            expect(next.eventData.playerName).toEqual('1');
            expect((next.eventData as JudgementEvent).card.body).toEqual('test');
            expect((next.eventData as JudgementEvent).card.owner).toEqual('test');
            expect((next.eventData as JudgementEvent).card.cardId).toEqual(0);
            expect((next.eventData as JudgementEvent).owner).toEqual('test');
            temp.unsubscribe();
            done()
        });
        client1 = io_client(HTTP_ROOT, {
            query: 'playerName' +
                '=' + '1',
            path: '/test'
        });
        client1.emit('judgment', {body: "test", cardId: 0, owner: "test"} as DealtCard)
    });
});
