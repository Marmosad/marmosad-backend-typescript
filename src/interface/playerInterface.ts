import {Card} from "./firestoreInterface";

export class PlayerInterface {
    playerName: string;
    hand: Array<Card>;
    isJudge: boolean;
    score: number;
    socketUrl: any;
}

export interface DealtCard extends Card{
    owner: string;
}
