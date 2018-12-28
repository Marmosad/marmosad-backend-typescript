import * as Socket from 'socket.io';
import {inject, injectable} from "inversify";
import {Http} from "./httpSingletonService";
import {Chat} from "../interface/socketInterface";
import {ConnectionEvent, RxEvents, RxEventsInterface} from "../interface/rxEventInterface";
import {PlayerDisplay} from "../object/boardComponent";

export interface SocketInterface {
    start(url, subject): void

    emitChat(room: string, usr: string, msg: string): void;

    url: string;
}

@injectable()
export class SocketService implements SocketInterface {
    private _io: Socket.Server = null;
    private _connections = new Map<string, Socket.Socket>();
    private _url: string;
    private gameEventEmitter = null;

    constructor(@inject(Http) private http: Http) {
    }

    public start(url, subject: (gameEvent: RxEventsInterface) => void): void {
        this._url = url;
        this._io = Socket(this.http.httpServer, {
            path: this._url, serveClient: false,
            // below are engine.IO options
            pingInterval: 1000,
            pingTimeout: 2000,
            cookie: false
        });
        console.log('[EVENT] socket started at ' + this.io.path());
        this.io.on('connection', (socket: Socket.Socket) => {
            this.handleNewConnection(socket)
        });
        this.gameEventEmitter = subject;
    }

    public stop(): Promise<void> {
        return new Promise<void>(resolve => {
            for (let key in this._connections) {
                if (this._connections[key] && this._connections[key].disconnect) {
                    this._connections[key].disconnect()
                }
            }
        })
    }

    public emitChat(usr: string, msg: string): void {
        console.log('[EVENT] Emitted chat', {from: usr, msg: msg} as Chat);
        this.io.to('chat').emit('chat', {from: usr, msg: msg} as Chat);
    }

    private handleNewConnection(socket: Socket.Socket): void {
        const name = socket.handshake.query.boardName;
        console.log('[EVENT] Player: ' + name + ' joined.');
        this.setupSocket(socket, name);
        this.addConnection(name, socket);
        if (this.gameEventEmitter == null)
            return;
        this.gameEventEmitter({
            event: RxEvents.playerConnect,
            eventData: {playerName: name, socketUrl: this.io.path()} as ConnectionEvent
        });
    }

    private handleDisconnect(socket: Socket.Socket, playerName) {
        this._connections.delete(playerName);
        if (this.gameEventEmitter == null)
            return;
        this.gameEventEmitter({
            event: RxEvents.playerDisconnect,
            eventData: {playerName: playerName, socketUrl: this.io.path()} as ConnectionEvent
        });
    }

    private setupSocket(socket: Socket.Socket, playerName) {
        socket.join('chat');
        socket.join(playerName);
        socket.on('chat', (msg) => {
            console.log('chat found', msg);
            if (msg.trim()) {
                this.emitChat(playerName, msg);
            }
        });
        socket.on('startGame', () => {
            console.log('[EVENT] startGame socket event triggered');
            this.gameEventEmitter({event: RxEvents.startGame, eventData: null} as RxEventsInterface)
        });
        socket.on('kill', (reason) => {
            this.getConnection(playerName).disconnect(true);
        });
        socket.on('disconnecting', (reason) => {
            console.log('[EVENT] ' + playerName + ' disconnecting due to ' + reason);
            this.handleDisconnect(socket, playerName)
        });
    }

    private addConnection(playerName: string, socket: Socket.Socket): void {
        this._connections.set(playerName, socket);
    }

    public getConnection(playerName: string): Socket.Socket {
        return this._connections.get(playerName)
    }

    public emitDisplayUpdate(playerName: string, display: PlayerDisplay) {
        this.io.to(playerName).emit('updateDisplay', display)
    }

    get url(): string {
        return this._url;
    }

    get io() {
        return this._io
    }
}
