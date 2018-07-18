import dbService from './dbService'
import rxService from './rxService'

function getRandomInt(min, max) {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1
    }
    return retval;
}
class JsonService{
    playerSubject;
    whiteCardSubject;
    blackCardSubject;

    constructor() {
        dbService.start();
        this.playerSubject = rxService.getPlayerSubject();
        this.whiteCardSubject = rxService.getWhiteCardSubject();
        this.blackCardSubject = rxService.getBlackCardSubject();
    }

    createPlayer (callback, playerId) {
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
    }
    getNewBlackCard () {
        dbService.getBlackCard(getRandomInt(1, dbService.getBlackCardSize()), function (blackCard) {
            this.blackCardSubject.next(blackCard);
        })
    }
    getNewWhiteCard (owner) {
        dbService.getWhiteCard(getRandomInt(1, dbService.getBlackCardSize()), function (card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: owner
            };
            this.whiteCardSubject.next(whiteCard);
        })
    }
}

const jsonService = new JsonService();
export default jsonService;