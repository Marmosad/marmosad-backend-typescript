// import { dbService, rxService } from '../barrels/services';
import { interfaces, injectable, inject } from "inversify";
import { TYPES } from "../models/types";
import { DbInterface } from "./dbService";
import { WhiteCardModel } from '../models/jsonModel';
import { getRandomInt } from '../handlers/rxHandler'

export interface JsonInterface {
    dbService: DbInterface;
    createPlayer(callback, playerID): void;
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
}
