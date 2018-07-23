import Board from "../board";
import {ChatHandler} from "../barrels/handlers";

export default class SocketHandler{
    private io = null;
    private _url = '';
    private chatHandler;
    private board;
    constructor(board: Board){
        this.chatHandler = new ChatHandler(board, this);
        this.board = board;
    }

    start(http) {
        this.url = this.board.name;
        this.io = require('socket.io')(http,{ path: '/' + this.board.name});
        this.io.on('connection', function (socket) {
            this.setupSocket(socket);
        });
    }
    emit(a, b) {
        this.io.emit(a, b);
    }
    setupSocket(socket){
        this.board.joinedPlayer(socket.handshake.query.name, socket, socket.id);
        socket.on('sendMsg', function (data) {
            this.chatHandler.onMessage(data.msg, data.from);
        });
        socket.on('disconnect', function (reason) {
            console.log(socket.id + ' ' + reason);
            this.board.removePlayer(socket.id);
        });
        socket.on('startGame', function () {
            console.log('startGame Socket event');
            this.board.startGame();
        });
        socket.on('reset', function () {
            this.io.emit('boardReset', null);
            var players = Object.keys(this.board.getPlayers());
            for (var i in players) {
                this.board.removePlayer(players[i]);
            }
            this.board.reset();
        });
        socket.on('submission', function (card) {
            console.log(card + "submitted");
            console.log(this.board.submission(card));
        });

        socket.on('judgment', function (card) {
            this.board.judgement(card); // TODO why does this count as a submission
        });
    }
    get url() {
        return this._url;
    }
    set url(url: string) {
        this._url = url;
    }
}