import Board from "../board";
import {ChatHandler} from "../barrels/handlers";

export default class SocketHandler{
    private io = null;
    private _url = '';
    private chatHandler: ChatHandler;
    private board: Board;
    constructor(board: Board){
        this.chatHandler = new ChatHandler(board, this);
        this.board = board;
    }

    start(http): void {
        let self = this;
        this.url = this.board.name;
        this.io = require('socket.io')(http,{ path: '/' + this.board.name});
        this.io.on('connection', function (socket) {
            self.setupSocket(socket);
        });
    }
    emit(a, b): void {
        this.io.emit(a, b);
    }
    setupSocket(socket): void{
        let self = this;
        console.log(socket.handshake.query.name, socket, socket.id);
        this.board.joinedPlayer(socket.handshake.query.name, socket, socket.id);
        socket.on('sendMsg', function (data) {
            self.chatHandler.onMessage(data.msg, data.from);
        });
        socket.on('disconnect', function (reason) {
            console.log(socket.id + ' ' + reason);
            self.board.removePlayer(socket.id);
        });
        socket.on('startGame', function () {
            console.log('startGame Socket event');
            self.board.startGame();
        });
        socket.on('reset', function () {
            self.io.emit('boardReset', null);
            var players = Object.keys(self.board.getPlayers());
            for (var i in players) {
                self.board.removePlayer(players[i]);
            }
            self.board.reset();
        });
        socket.on('submission', function (card) {
            console.log(card + "submitted");
            console.log(self.board.submission(card));
        });

        socket.on('judgment', function (card) {
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