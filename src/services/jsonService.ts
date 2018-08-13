// import { dbService, rxService } from '../barrels/services';
import { interfaces, injectable, inject } from "inversify";
import { TYPES } from "../models/types";
import { DbInterface } from "./dbService";
import { WhiteCardModel } from '../models/jsonModel';

export interface JsonInterface {
    dbService: DbInterface;
    createPlayer(callback, playerID);
    getNewBlackCard();
    getNewWhiteCard(owner);
}

@injectable()
export class JsonService implements JsonInterface{
    public dbService: DbInterface;


    constructor(
        @inject(TYPES.DbInterface) _dbService: DbInterface,
    ) {
        this.dbService = _dbService;
        this.dbService.start();
    }

    createPlayer (callback, playerId): void {
        let self = this;
        var hand = [];

        function recursion(card) {
            console.log(card);
            var whiteCard = new WhiteCardModel();
            whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: playerId
            };
            console.log(whiteCard);
            hand.push(whiteCard);
            if (hand.length !== 7) {
                self.dbService.getWhiteCard(getRandomInt(1, self.dbService.whiteCardsSize), recursion);
            }
            else {callback(hand);
            }
        }
        this.dbService.getWhiteCard(getRandomInt(1, this.dbService.whiteCardsSize), recursion);
    }
    getNewBlackCard () {
        this.dbService.getBlackCard(getRandomInt(1, this.dbService.blackCardsSize), function (blackCard) {
            this.blackCardSubject.next(blackCard);
        })
    }
    getNewWhiteCard (owner) {
        this.dbService.getWhiteCard(getRandomInt(1, this.dbService.blackCardsSize), function (card) {
            var whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: owner
            };
            this.whiteCardSubject.next(whiteCard);
        })
    }
}

function getRandomInt(min, max): number {
    var retval = Math.floor(Math.random() * (max - min + 1)) + min;
    if (retval < 1) {
        retval = 1
    }
    return retval;
}
