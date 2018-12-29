import {DealtCard, PlayerInterface} from "../interface/playerInterface";
import {Card} from "../interface/firestoreInterface";
import {inject} from "inversify";
import {FirestoreService} from "../service/firestoreService";

export class Player implements PlayerInterface {
    public hand: Array<DealtCard> = [];
    public isJudge: boolean = false;
    public playerName: string;
    public score: number = 0;
    public socketUrl: string;
    public hasPlayed: boolean = false;
    @inject(FirestoreService) private firestoreService: FirestoreService;

    constructor(socketUrl: string, playerName: string) {
        this.playerName = playerName;
        this.socketUrl = socketUrl;
    }

    public fillHand(card: DealtCard) {
        this.hand.push(card);
    }

    public removeCard(card: DealtCard) {
        for (let i = 0; i < this.hand.length; i++) {
            if (this.hand[i].cardId === card.cardId)
                this.hand.splice(i, 1);
        }
    }
}
