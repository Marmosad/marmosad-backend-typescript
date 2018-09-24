import Board from '../board';
import { ChatHandler } from '../barrels/handlers';
import { Socket } from 'socket.io';

export default class SocketHandler {
    private io: Socket = null;
    private _url = '';
    private chatHandler: ChatHandler;
    private board: Board;
    constructor(board: Board) {
        board.boardInfo.socketUrl = '/' + board.boardInfo.instanceId.getTime();
        this.url = board.boardInfo.socketUrl;
        this.chatHandler = new ChatHandler(board, this);
        this.board = board;
    }

    start(http): void {
        let self = this;
        this.io = require('socket.io')(http, { path: this.url });
        this.io.on('connection', function(socket) {
            self.setupSocket(socket);
        });
    }
    emit(a, b): void {
        this.io.emit(a, b);
    }
    setupSocket(socket: Socket): void {
        let self = this;
        this.board.joinedPlayer(socket.handshake.query.name, socket, socket.id);
        socket.on('sendMsg', function(data) {
            console.log(self.io.client);
            self.chatHandler.onMessage(data.msg, data.from);
        });
        socket.on('disconnect', function(reason) {
            console.log(socket.id + ' ' + reason);
            self.board.removePlayer(socket.id);
        });
        socket.on('startGame', function() {
            console.log('startGame Socket event');
            console.log(self.io.client);
            self.board.startGame();
        });
        socket.on('reset', function() {
            self.io.emit('boardReset', null);
            var playerKeys = Object.keys(self.board.getPlayers());
            playerKeys.forEach((playerId: string) => {
                self.board.removePlayer(playerId);
            });
            self.board.reset();
        });
        socket.on('submission', function(card) {
            console.log(card + 'submitted');
            if (!!card) {
                console.log(self.board.submission(card));
            }
        });

        socket.on('judgment', function(card) {
            self.board.judgement(card); // TODO why does this count as a submission
        });
    }
    get url(): string {
        return this._url;
    }
    set url(url: string) {
        this._url = url;
    }
}
