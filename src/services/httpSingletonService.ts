import {injectable} from "inversify";
import * as express from "express";
import {container} from "../inversify.config";
import BoardService from "./boardServices";
import * as bodyParser from "body-parser";
import {PORT} from "../config";
import * as uuid4 from 'uuid/v4'

export interface HttpInterface {
    http: express.Application;
    port: string;
    uuid: string;
}


@injectable()
export class Http implements HttpInterface {
    private readonly _http: express.Application;
    private readonly _port: string;
    private readonly _uuid: string = uuid4();

    constructor() {
        this._http = express();
        this.config();
        this._port = PORT;
    }

    private config(): void {
        // support application/json type post data
        this._http.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this._http.use(bodyParser.urlencoded({extended: false}));
    }

    get port(): string {
        return this._port;
    }

    get http() {
        return this._http
    }

    get uuid() {
        return this._uuid
    }

    public async httpStart(): Promise<void> {
        return new Promise<void>(resolve => {
            this._http.listen(this._port, () => {
                console.log('Express server listening on port ' + this._port);
                resolve();
            });
        })
    }
}