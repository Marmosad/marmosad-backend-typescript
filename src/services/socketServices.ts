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
    private io: Socket.Server = null;
    private connections: {};
    private _url: string;
    constructor(@inject(Http) private http: Http) {
    }

    public start(url): void {
        const self = this;
        this._url = url;
        this.io = Socket(this.http);
        console.log('started socket at ' + url);
        this.io.on('connection', function(socket:Socket.Socket) {
            console.log('[EVENT] Player: ' + socket.handshake.query.name + ' joined.')
            socket.join('chat');
            socket.join('game');
            self.addPlayer(socket.handshake.query.name, socket);
        });
        this.io.on('chat', (from, data) =>{
            console.log('chat found');
            this.emitChat(from, data);
        })
    }
    public stop(): Promise<void> {
        return new Promise<void>(resolve => {
            for (let key in this.connections) {
                if (this.connections[key] && this.connections[key].disconnect){
                    this.connections[key].disconnect()
                }
            }
        })
    }
    public emitChat(usr: string, msg: string): void {
        this.io.to('chat').emit(usr, msg);
    }

    public addPlayer(name: string, socket: Socket.Socket): void {
        this.connections[name] = socket;
    }

    get url(): string {
        return this._url;
    }
}
