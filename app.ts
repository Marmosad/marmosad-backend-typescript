import express = require('express');
var app = express();
import * as httpClass from 'http';
//@ts-ignore
var http = httpClass.Server(app);

import path = require('path'); //was const var
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
    console.log('serving files');
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/playerLimit', function (req, res) {
    res.send(JSON.stringify({isLimitReached: boardInstance.isLimitReached()}));
})

http.listen(8081, function () {
    console.log('listening on *: 8081');
});

import board from './src/board';
var boardInstance = new board();
console.log(boardInstance.initInstance(http));