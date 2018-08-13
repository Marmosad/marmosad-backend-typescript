import { DbInterface } from "../services/dbService";

var Rx = require('rxjs');

export default class RxHandler {

    dbService: DbInterface;
    playerSubject = new Rx.Subject();
    blackCardSubject = new Rx.Subject();
    whiteCardSubject = new Rx.Subject();

    constructor(dbService: DbInterface) {
        this.dbService = dbService;
    }

    getPlayerSubject (): any {
        return this.playerSubject
    }
    
    getBlackCardSubject (): any {
        return this.blackCardSubject;
    }
    
    getWhiteCardSubject (): any {
        return this.whiteCardSubject;
    }
    getNewBlackCard () {
        let self = this;

        this.dbService.getBlackCard(getRandomInt(1, this.dbService.blackCardsSize), function (blackCard) {
            console.log('black card', blackCard);
            self.blackCardSubject.next(blackCard);
        })
    }
    getNewWhiteCard (owner) {
        let self = this;
        this.dbService.getWhiteCard(getRandomInt(1, this.dbService.blackCardsSize), function (card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: owner
            };
            self.whiteCardSubject.next(whiteCard);
        })
    }    
}

export function getRandomInt(min, max): number {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1
    }
    return retval;
}