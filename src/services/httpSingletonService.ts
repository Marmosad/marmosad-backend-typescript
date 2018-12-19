import {injectable} from "inversify";
import * as express from "express";
import {Server, createServer} from "http";
import * as bodyParser from "body-parser";
import {PORT} from "../config";
import * as uuid4 from 'uuid/v4'

export interface HttpInterface {
    port: string;
    uuid: string;
    httpServer: Server;
}


@injectable()
export class Http implements HttpInterface {
    private readonly _express: express.Application;
    private readonly _httpServer: Server;
    private readonly _port: string;
    private readonly _uuid: string = uuid4();

    constructor() {
        this._express = express();
        this._httpServer = createServer(this._express);
        this.config();
        this._port = PORT;
    }

    private config(): void {
        // support application/json type post data
        this._express.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this._express.use(bodyParser.urlencoded({extended: false}));
    }

    get port(): string {
        return this._port;
    }

    get httpServer(): Server {
        return this._httpServer
    }

    get express() {
        return this._express
    }

    get uuid() {
        return this._uuid
    }

    public async httpStart(): Promise<void> {
        return new Promise<void>(resolve => {
            this.httpServer.listen(this._port, () => {
                console.log('Express server listening on port ' + this._port);
                resolve();
            });
        })
    }
}