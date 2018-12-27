import {PlayerInterface} from "../interface/playerInterface";
import {Card} from "../interface/firestoreInterface";
import {inject} from "inversify";
import {FirestoreService} from "../service/firestoreService";

export class Player implements PlayerInterface {
    public hand: Array<Card> = [];
    public isJudge: boolean;
    public playerName: string;
    public score: number;
    public socketUrl: string;
    public hasPlayed: boolean = false;
    @inject(FirestoreService) private firestoreService: FirestoreService;

    constructor(socketUrl: string, playerName: string) {
        this.playerName = playerName;
        this.socketUrl = socketUrl;
        this.isJudge = false;
        this.score = 0;
    }

    public fillHand(card: Card) {
        console.log('[DBG] new card added to hand: ', card);
        this.hand.push(card);
    }
}