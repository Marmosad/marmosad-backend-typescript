import Rx = require('rxjs');
import * as board from ('../board.js'); //should be board.ts?
var playerSubject = new Rx.Subject();
var blackCardSubject = new Rx.Subject();
var whiteCardSubject = new Rx.Subject();

module.exports = {
    getPlayerSubject: function () {
      return playerSubject
    },
    getBlackCardSubject: function () {
        return blackCardSubject;
    },
    getWhiteCardSubject: function () {
        return whiteCardSubject;
    }
};