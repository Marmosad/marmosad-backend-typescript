dbService = require('../dataServices/dbService');
dbService.start();
var rxService = require('../dataServices/rxService');
var playerSubject = rxService.getPlayerSubject();
var blackCardSubject = rxService.getBlackCardSubject();
var whiteCardSubject = rxService.getWhiteCardSubject();

function getRandomInt(min, max) {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1
    }
    return retval;
}
module.exports = {
    createPlayer: function (callback, playerId) {
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
                dbService.getWhiteCard(getRandomInt(1, dbService.getWhiteCardSize()), recursion);
            }
            else {callback(hand);
            }
        }
        dbService.getWhiteCard(getRandomInt(1, dbService.getWhiteCardSize()), recursion);
    },
    getNewBlackCard: function () {
        dbService.getBlackCard(getRandomInt(1, dbService.getBlackCardSize()), function (blackCard) {
            blackCardSubject.next(blackCard);
        })
    },
    getNewWhiteCard: function (owner) {
        dbService.getWhiteCard(getRandomInt(1, dbService.getBlackCardSize()), function (card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: owner
            };
            whiteCardSubject.next(whiteCard);
        })
    }
};