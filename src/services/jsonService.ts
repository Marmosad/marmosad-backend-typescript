// import { dbService, rxService } from '../barrels/services';
import { interfaces, injectable, inject } from "inversify";
import { TYPES } from "./containerService";
import { DbInterface } from "./dbService";
import { RxInterface } from "./rxService";

export interface JsonInterface {
    createPlayer(callback, playerID);
    getNewBlackCard();
    getNewWhiteCard(owner);    
}

function getRandomInt(min, max) {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1
    }
    return retval;
}

@injectable()
export class JsonService implements JsonInterface{
    playerSubject;
    whiteCardSubject;
    blackCardSubject;
    dbService: DbInterface;
    rxService: RxInterface;

    constructor(
        @inject(TYPES.DbInterface) _dbService: DbInterface,
        @inject(TYPES.RxInterface) _rxService: RxInterface
    ) {
        this.dbService = _dbService;
        this.rxService = _rxService;
        this.dbService.start();
        this.playerSubject = this.rxService.getPlayerSubject();
        this.whiteCardSubject = this.rxService.getWhiteCardSubject();
        this.blackCardSubject = this.rxService.getBlackCardSubject();
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
                this.dbService.getWhiteCard(getRandomInt(1, this.dbService.getWhiteCardSize()), recursion);
            }
            else {callback(hand);
            }
        }
        this.dbService.getWhiteCard(getRandomInt(1, this.dbService.getWhiteCardSize()), recursion);
    }
    getNewBlackCard () {
        this.dbService.getBlackCard(getRandomInt(1, this.dbService.getBlackCardSize()), function (blackCard) {
            this.blackCardSubject.next(blackCard);
        })
    }
    getNewWhiteCard (owner) {
        this.dbService.getWhiteCard(getRandomInt(1, this.dbService.getBlackCardSize()), function (card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: owner
            };
            this.whiteCardSubject.next(whiteCard);
        })
    }
}