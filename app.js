"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var httpClass = require("http");
//@ts-ignore
var http = httpClass.Server(app);
var path = require('path'); //was const
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', function (req, res) {
    console.log('serving files');
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});
app.get('/playerLimit', function (req, res) {
    res.send(JSON.stringify({ isLimitReached: boardInstance.isLimitReached() }));
});
http.listen(8081, function () {
    console.log('listening on *: 8081');
});
var board_1 = require("./src/board");
var boardInstance = new board_1["default"]();
console.log(boardInstance.initInstance(http));
