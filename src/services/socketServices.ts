import * as Socket from 'socket.io';
import {Connection} from "../models/playerModel";
import {getServiceIdentifierAsString, inject, injectable} from "inversify";
import {Http} from "./httpSingletonService";
import {TYPES} from "../models/types";
export interface SocketInterface {
    start(url): void
    emitChat(room: string, usr: string, msg: string): void;
    url: string;
}

@injectable()
export class SocketService implements SocketInterface{
    private _io: Socket.Server = null;
    private _connections = {};
    private _url: string;
    constructor(@inject(Http) private http: Http) {
    }

    public start(url): void {
        const self = this;
        this._url = '/' + url;
        this._io = Socket(this.http.httpServer, {path: this._url});
        console.log('[DBG] socket started at ' + this._io.path());
        this._io.on('connection', function(socket:Socket.Socket) {
            console.log('[EVENT] Player: ' + socket.handshake.query.name + ' joined.')
            socket.join('chat');
            socket.join('game');
            self.addPlayer(socket.handshake.query.name, socket);
        });
        this._io.on('chat', (from, data) =>{
            console.log('chat found');
            this.emitChat(from, data);
        })
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
        this._io.to('chat').emit(usr, msg);
    }

    public addPlayer(name: string, socket: Socket.Socket): void {
        this._connections[name] = socket;
    }

    get url(): string {
        return this._url;
    }

    get io() {
        return this._io
    }
}
