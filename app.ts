import express = require('express');
import * as httpClass from 'http';
import { BoardInterface } from './src/services/boardService';
import * as cors from 'cors';
import { container } from './src/services/containerService';
import { TYPES } from './src/models/types'
import { EnvInterface } from "./src/services/envService";
import * as bodyParser from "body-parser";


// pre-initialize all services for non service classes to use TODO: REMOVE
// import { dbService, envService, jsonService, playerService, rxService } from './src/barrels/services'

export class App {


    public boardService: BoardInterface
    public app = express();

    public http = new httpClass.Server(this.app);

    constructor(){

        this.boardService = container.get<BoardInterface>(TYPES.BoardInterface);

    }

}

const appInstance = new App();

appInstance.http.listen(8081, function () {
    console.log('listening on *: 8081');
});

const path = require('path'); // was const

let envService = container.get<EnvInterface>(TYPES.EnvInterface);
console.log('Running in production mode:', envService.prodMode ? 'true' : 'false');

if(envService.prodMode) {
    appInstance.app.get('/', function (req, res) {
        console.log('serving files');   
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
} else {
    appInstance.app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
}

appInstance.app.use(express.static(path.join(__dirname, 'dist')));
appInstance.app.use(bodyParser.json());
appInstance.app.use(bodyParser.urlencoded({ extended: false }));

appInstance.app.get('/boards', function (req, res) {
    res.send(JSON.stringify(appInstance.boardService.getBoardsInfo()));
});

appInstance.app.post('/boards/generate', function (req, res) {
    const nonRepeating = (appInstance.boardService.newBoard(req.body.name, req.body.playerLimit) !== null);
    console.log(nonRepeating);
    if(nonRepeating) {
        res.send();
    } else {
        res.status(404).send();
    }
});

appInstance.app.post('/boards/update', function (req, res) {
    appInstance.boardService.updateBoard(req.body.socketUrl, req.body.newPlayerLimit, req.body.newName);
    const updatedBoardInfo = appInstance.boardService.getBoardInfo(req.body.socketUrl)
    console.log(updatedBoardInfo);
    res.send(JSON.stringify(updatedBoardInfo));
});

export {
    appInstance
}
