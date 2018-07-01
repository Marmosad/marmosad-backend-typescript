import express = require('express');
var app = express();
import * as httpClass from 'http';
//@ts-ignore
var http = httpClass.Server(app);

const path = require('path'); //was const
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function (req, res) {
    console.log('serving files');
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.get('/playerLimit', function (req, res) {
    console.log(board.isLimitReached());
    res.send(JSON.stringify({isLimitReached: board.isLimitReached()}));
})

http.listen(8081, function () {
    console.log('listening on *: 8081');
});

import board from './src/board';
console.log(board.initInstance(http));