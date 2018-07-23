import express = require('express');
import * as httpClass from 'http';
import { BoardHandler } from './src/barrels/handlers';
import * as cors from 'cors';

// pre-initialize all services for non service classes to use
import { dbService, envService, jsonService, playerService, rxService } from './src/barrels/services'

export class App {


    public boardHandler: BoardHandler
    public app = express();

    public http = new httpClass.Server(this.app);

    constructor(){

        this.boardHandler = new BoardHandler(this);

    }

}

const appInstance = new App();
export default appInstance;

appInstance.http.listen(8081, function () {
    console.log('listening on *: 8081');
});

const path = require('path'); // was const

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
    console.log(appInstance.boardHandler.getBoardsInfo());
    res.send(JSON.stringify(appInstance.boardHandler.getBoardsInfo()));
});