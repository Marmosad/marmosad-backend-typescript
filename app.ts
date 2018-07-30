import express = require('express');
import * as httpClass from 'http';
import { BoardInterface } from './src/services/boardService';
import * as cors from 'cors';
import { container } from './src/services/containerService';
import { TYPES } from './src/models/types'
import { EnvInterface } from "./src/services/envService";

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
export default appInstance;

appInstance.http.listen(8081, function () {
    console.log('listening on *: 8081');
});

const path = require('path'); // was const

let envService = container.get<EnvInterface>(TYPES.EnvInterface);
console.log('Running is production mode:', envService.prodMode ? 'true' : 'false');

if(envService.prodMode) {
    appInstance.app.get('/', function (req, res) {
        console.log('serving files');
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
} else {
    appInstance.app.use(cors());
}

appInstance.app.use(express.static(path.join(__dirname, 'dist')));


appInstance.app.get('/boards', function (req, res) {
    console.log(appInstance.boardService.getBoardsInfo());
    res.send(JSON.stringify(appInstance.boardService.getBoardsInfo()));
});