var Rx = require('rxjs');
var board = require('../board.js');
var playerSubject = new Rx.Subject();
var blackCardSubject = new Rx.Subject();
var whiteCardSubject = new Rx.Subject();
var self = module.exports = {
    getPlayerSubject: function () {
        return playerSubject;
    },
    getBlackCardSubject: function () {
        return blackCardSubject;
    },
    getWhiteCardSubject: function () {
        return whiteCardSubject;
    }
};
