import express = require('express');
import * as httpClass from 'http';
import boardHandler from './src/boardHandler';
//@ts-ignore

class App {

    public app = express();

    public http = new httpClass.Server(this.app);

    constructor(){

        this.http.listen(8081, function () {
            console.log('listening on *: 8081');
        });

        const path = require('path'); //was const

        this.app.get('/', function (req, res) {
            console.log('serving files');
            res.sendFile(path.join(__dirname, 'dist/index.html'));
        });

        this.app.get('/boards', function (req, res) {
            res.send(JSON.stringify(boardHandler.getBoardsInfo()));
        });

        this.app.use(express.static(path.join(__dirname, 'dist')));

        console.log(boardHandler);
}

}

export default new App();