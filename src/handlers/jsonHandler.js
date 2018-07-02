"use strict";
exports.__esModule = true;
var dbService_1 = require("../dataServices/dbService");
var rxService_1 = require("../dataServices/rxService");
function getRandomInt(min, max) {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1;
    }
    return retval;
}
var jsonHandler = /** @class */ (function () {
    function jsonHandler() {
        dbService_1["default"].start();
        this.playerSubject = rxService_1["default"].getPlayerSubject();
        this.whiteCardSubject = rxService_1["default"].getWhiteCardSubject();
        this.blackCardSubject = rxService_1["default"].getBlackCardSubject();
    }
    jsonHandler.prototype.createPlayer = function (callback, playerId) {
        var hand = [];
        function recursion(card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: playerId
            };
            console.log(whiteCard);
            hand.push(whiteCard);
            if (hand.length !== 7) {
                dbService_1["default"].getWhiteCard(getRandomInt(1, dbService_1["default"].getWhiteCardSize()), recursion);
            }
            else {
                callback(hand);
            }
        }
        dbService_1["default"].getWhiteCard(getRandomInt(1, dbService_1["default"].getWhiteCardSize()), recursion);
    };
    jsonHandler.prototype.getNewBlackCard = function () {
        dbService_1["default"].getBlackCard(getRandomInt(1, dbService_1["default"].getBlackCardSize()), function (blackCard) {
            this.blackCardSubject.next(blackCard);
        });
    };
    jsonHandler.prototype.getNewWhiteCard = function (owner) {
        dbService_1["default"].getWhiteCard(getRandomInt(1, dbService_1["default"].getBlackCardSize()), function (card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: owner
            };
            this.whiteCardSubject.next(whiteCard);
        });
    };
    return jsonHandler;
}());
exports["default"] = new jsonHandler();
