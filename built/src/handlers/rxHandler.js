"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require('rxjs');
var RxHandler = /** @class */ (function () {
    function RxHandler(dbService) {
        this.playerSubject = new Rx.Subject();
        this.blackCardSubject = new Rx.Subject();
        this.whiteCardSubject = new Rx.Subject();
        this.dbService = dbService;
    }
    RxHandler.prototype.getPlayerSubject = function () {
        return this.playerSubject;
    };
    RxHandler.prototype.getBlackCardSubject = function () {
        return this.blackCardSubject;
    };
    RxHandler.prototype.getWhiteCardSubject = function () {
        return this.whiteCardSubject;
    };
    RxHandler.prototype.getNewBlackCard = function () {
        var self = this;
        this.dbService.getBlackCard(getRandomInt(1, this.dbService.blackCardsSize), function (blackCard) {
            // console.log('black card', blackCard);
            self.blackCardSubject.next(blackCard);
        });
    };
    RxHandler.prototype.getNewWhiteCard = function (owner) {
        var self = this;
        this.dbService.getWhiteCard(getRandomInt(1, this.dbService.blackCardsSize), function (card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: owner
            };
            self.whiteCardSubject.next(whiteCard);
        });
    };
    return RxHandler;
}());
exports.default = RxHandler;
function getRandomInt(min, max) {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1;
    }
    return retval;
}
exports.getRandomInt = getRandomInt;
