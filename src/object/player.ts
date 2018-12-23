import {PlayerInterface} from "../interface/playerInterface";
import {Card} from "../interface/firestoreInterface";

export class Player implements PlayerInterface{
    hand: Array<Card>;
    isJudge: boolean;
    playerName: string;
    score: number;
    socketUrl: any;

}