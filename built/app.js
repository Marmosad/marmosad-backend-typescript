"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var httpClass = require("http");
var cors = require("cors");
var containerService_1 = require("./src/services/containerService");
var types_1 = require("./src/models/types");
var bodyParser = require("body-parser");
// pre-initialize all services for non service classes to use TODO: REMOVE
// import { dbService, envService, jsonService, playerService, rxService } from './src/barrels/services'
var App = /** @class */ (function () {
    function App() {
        this.app = express();
        this.http = new httpClass.Server(this.app);
        this.boardService = containerService_1.container.get(types_1.TYPES.BoardInterface);
    }
    return App;
}());
exports.App = App;
var appInstance = new App();
exports.appInstance = appInstance;
var path = require('path'); // was const
var envService = containerService_1.container.get(types_1.TYPES.EnvInterface);
console.log('Running in production mode:', envService.prodMode ? 'true' : 'false');
if (envService.prodMode) {
    appInstance.app.get('/', function (req, res) {
        console.log('serving files');
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
}
else {
    var allowCrossDomain = function (req, res, next) {
        appInstance.app.use(cors());
    };
    appInstance.app.use(cors());
}
appInstance.http.listen(8081, function () {
    console.log('listening on *: 8081');
});
appInstance.app.use(express.static(path.join(__dirname, 'dist')));
appInstance.app.use(bodyParser.json());
appInstance.app.use(bodyParser.urlencoded({ extended: false }));
appInstance.app.get('/boards', function (req, res) {
    res.send(JSON.stringify(appInstance.boardService.getBoardsInfo()));
});
appInstance.app.post('/boards/generate', function (req, res) {
    var nonRepeating = (appInstance.boardService.newBoard(req.body.name, req.body.playerLimit) !== null);
    if (nonRepeating) {
        res.send();
    }
    else {
        res.status(404).send();
    }
});
appInstance.app.post('/boards/update', function (req, res) {
    appInstance.boardService.updateBoard(req.body.socketUrl, req.body.newPlayerLimit, req.body.newName);
    var updatedBoardInfo = appInstance.boardService.getBoardInfo(req.body.socketUrl);
    res.send(JSON.stringify(updatedBoardInfo));
});
