import * as Socket from 'socket.io';
import {getServiceIdentifierAsString, inject, injectable} from "inversify";
import {Http} from "./httpSingletonService";
import {Chat} from "../models/socketModel";
export interface SocketInterface {
    start(url): void
    emitChat(room: string, usr: string, msg: string): void;
    url: string;
}

@injectable()
export class SocketService implements SocketInterface{
    private _io: Socket.Server = null;
    private _connections = new Map<string, Socket.Socket>();
    private _url: string;
    constructor(@inject(Http) private http: Http) {
    }

    public start(url): void {
        this._url = '/' + url;
        this._io = Socket(this.http.httpServer, {path: this._url});
        this.io.setMaxListeners(Infinity);
        console.log('[DBG] socket started at ' + this.io.path());
        this.io.on('connection', (socket: Socket.Socket) => {
            socket.on('disconnecting', (reason) => {
                console.log('disconneting');
            });
            this.handleNewConnection(socket)
        });
    }
    public stop(): Promise<void> {
        return new Promise<void>(resolve => {
            for (let key in this._connections) {
                if (this._connections[key] && this._connections[key].disconnect){
                    this._connections[key].disconnect()
                }
            }
        })
    }
    public emitChat(usr: string, msg: string): void {
        console.log('[EVENT] Emitted chat', {from: usr, msg: msg} as Chat);
        this.io.to('chat').emit('chat', {from: usr, msg: msg} as Chat);
    }
    private handleNewConnection(socket:Socket.Socket): void {
        const name = socket.handshake.query.name;
        console.log('[EVENT] Player: ' + name + ' joined.');
        this.setupSocket(socket, name);
        this.addConnection(name, socket);
    }
    private handleDisconnect(socket: Socket.Socket, name) {
        this._connections.delete(name);
    }

    private setupSocket(socket: Socket.Socket, name) {
        socket.join('chat');
        socket.join('game');
        socket.on('chat', (msg) => {
            console.log('chat found', msg);
            if (msg.trim()) {
                this.emitChat(name, msg);
            }
        });
    }

    private addConnection(name: string, socket: Socket.Socket): void {
        this._connections.set(name, socket);
    }

    public getConnection(name: string): Socket.Socket {
        return this._connections.get(name)
    }
    get url(): string {
        return this._url;
    }

    get io() {
        return this._io
    }
}
