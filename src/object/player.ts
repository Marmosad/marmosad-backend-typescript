import {PlayerInterface} from "../Interface/playerInterface";
import {Card} from "../Interface/firestoreInterface";

export class Player implements PlayerInterface{
    hand: Array<Card>;
    isJudge: boolean;
    playerName: string;
    score: number;
    socketUrl: any;

}