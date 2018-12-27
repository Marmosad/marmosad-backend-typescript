import {container} from "../../src/inversify.config";
import {SocketService} from "../../src/service/socketService";
import * as jest from "ts-jest"
import {Http} from "../../src/service/httpSingletonService";
import * as io_client from "socket.io-client"
import {Chat} from "../../src/interface/socketInterface";

console.log('Testing on jest ' + jest.version);

const HTTP_ROOT = 'http://localhost:8081/';
let socketA: SocketService;
let client1;
let client2;
let client3;
let client4;
let http;
describe('Socket service connect test', () => {
    afterEach(() => {
        socketA.stop();
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
                socketA.start('a', null);
                socketA.io.on('connection', function (socket: any) {
                    console.log('[TEST EVENT] Player: ' + socket.handshake.query.name + ' joined.');
                    expect(socket.handshake.query.name).toEqual('1');
                    done()
                });
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'name=' + "1",
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
                socketA.start('a', null);
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'name=' + name,
                    path: '/a'
                });
                socketA.io.on('connection', function (socket: any) {
                    console.log('[TEST EVENT] Player: ' + socket.handshake.query.name + ' joined.');
                    expect(socketA.getConnection(name).handshake.query.name).toEqual(name);
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
            socketA.start('a', null);
            console.log(HTTP_ROOT);
            client1 = io_client(HTTP_ROOT, {
                query: 'name=' + name,
                path: '/a'
            });
            socketA.io.on('connection', function (socket: any) {
                console.log('[TEST EVENT] Player: ' + socket.handshake.query.name + ' joined.');
                expect(socketA.getConnection(name).handshake.query.name).toEqual(name);
                done();
            });
        })
    });
    afterEach(() => {
        socketA.stop();
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
    afterEach(() => {
        socketA.stop();
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
                socketA.start('a', null);
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'name=' + '1',
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
                    query: 'name=' + '2',
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
                    query: 'name=' + '3',
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
                    query: 'name=' + '4',
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
                socketA.start('a', null);
                console.log(HTTP_ROOT);
                client1 = io_client(HTTP_ROOT, {
                    query: 'name=' + '1',
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
                    query: 'name=' + '2',
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
                    query: 'name=' + '3',
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
                    query: 'name=' + '4',
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
            })
        }
    );
});