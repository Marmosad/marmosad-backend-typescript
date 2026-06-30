import "reflect-metadata"
import BoardService from "./service/boardService";
import {container} from "./config/inversify.config";
import {Http} from "./service/httpSingletonService";
import {FirebaseEndpoints, Pack, Response} from "./interface/firestoreInterface";
import {FIREBASE_GET_BLACK_CARD, FIREBASE_GET_PACK, FIREBASE_GET_WHITE_CARD} from "./config/config";

export class App {
    private express = container.get<Http>(Http).express;
    private _port;
    private boardService: BoardService;
    private firebaseEndpoints: FirebaseEndpoints;

    constructor() {
        // Waits or server to boot.
        this.firebaseEndpoints = {
            getPack: FIREBASE_GET_PACK,
            getBlackCard: FIREBASE_GET_BLACK_CARD,
            getWhiteCard: FIREBASE_GET_WHITE_CARD,
        }
        container.get<Http>(Http).httpStart().then(() => {
            console.log('server started successfully.');
            this.setupEndpoints();
            this.boardService = new BoardService();
        }).catch((err) => {
            console.log(err)
        });
    }

    get port(): number {
        return this._port;
    }

    private setupEndpoints() {
        const self = this;
        self.express.get('/boards', function (req, res) {
            // Previously this handler fired a fire-and-forget request-promise
            // call to Firebase whose result was discarded and whose rejection
            // was swallowed by an empty .catch(), surfacing as an untraceable
            // uncaught exception. The response never depended on it, so the
            // stray call is removed; outbound Firebase calls belong in
            // FirestoreService, which handles their errors with context.
            res.send(self.boardService.getBoardsInfo());
        });

        self.express.post('/boards/generate', function (req, res) {
            const nonRepeating = self.boardService.newBoard(req.body.name, req.body.playerLimit);
            if (nonRepeating) {
                res.status(200).send({"message": "Successfully created " + req.body.name});
            } else {
                res.status(400).send({"message": "unable to create board" + req.body.name});
            }
        });

        self.express.post('/boards/remove', function (req, res) {
            const exist = self.boardService.removeBoard(req.body.socketUrl);
            if (exist) {
                res.status(200).send({"message": "Successfully removed " + req.body.socketUrl});
            } else {
                res.status(400).send({"message": "unable to delete board " + req.body.socketUrl});
            }
        });
    }
}


export default App;
