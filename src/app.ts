import "reflect-metadata"
import * as express from "express";
import * as bodyParser from "body-parser";
import {PORT} from "./config";
import BoardService, {} from "./services/boardServices";
import {container} from "./inversify.config";

export class App {
    public app: express.Application;
    private _port;
    public boardService: BoardService;
    constructor() {
        this.boardService = container.resolve<BoardService>(BoardService);
        this.app = express();
        this.config();
        this.setupEndpoints();
    }
    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        //port
        this._port = PORT
    }
    get port(): number {
        return this._port;
    }

    private setupEndpoints() {
        const self = this;
        self.app.get('/boards', function (req, res) {
            res.send(self.boardService.getBoardsInfo());
        });

        self.app.post('/boards/generate', function (req, res) {
            const nonRepeating = self.boardService.newBoard(req.body.name, req.body.playerLimit);
            if (nonRepeating) {
                res.status(200).send("Successfully created " + req.body.name);
            } else {
                res.status(400).send("unable to create board" + req.body.name);
            }
        });

        self.app.post('/boards/remove', function (req, res) {
            const exist = self.boardService.removeBoard(req.body.socketUrl);
            if (exist) {
                res.status(200).send("Successfully removed " + req.body.socketUrl);
            } else {
                res.status(400).send("unable to delete board " + req.body.socketUrl);
            }
        });
    }
}


export default new App();