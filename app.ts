import express = require('express');
var app = express();
import * as httpClass from 'http';
//@ts-ignore
var http = httpClass.Server(app);

const path = require('path'); //was const
app.use(express.static(path.join(__dirname, 'dist')));

import boardHandler from './src/boardHandler';
console.log(boardHandler);

http.listen(8081, function () {
    console.log('listening on *: 8081');
});

app.get('/', function (req, res) {
    console.log('serving files');
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

import BoardInfo from './src/models/boardModel';
app.get('/boards', function (req, res) {
    res.send(JSON.stringify(boardHandler.getBoardsInfo()));
})
