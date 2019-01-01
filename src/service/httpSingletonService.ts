import {injectable} from "inversify";
import * as express from "express";
import {Server, createServer} from "http";
import * as bodyParser from "body-parser";
import {ENV, PORT} from "../config/config";
import * as uuid4 from 'uuid/v4'
import * as cors from 'cors';

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

        console.log("[EVENT] The selected environment is: ", ENV);

        if (ENV === "DEV" ) {
            console.log("[WARNING] CORS is only enabled for :4200");
            this._express.use(cors({
                "origin": "http://localhost:4200",
                "preflightContinue": false,
                "credentials": true
            }));
        } else if (ENV === "PROD"){
            this._express.use(cors({
                "origin": "https://marmodb.firebaseapp.com",
                "preflightContinue": false,
                "credentials": true
            }));
        }
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
