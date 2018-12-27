import {Socket} from 'socket.io';
import {Card} from "./firestoreInterface";
import {Player} from "../object/player";

export class PlayerInterface {
    playerName: string;
    hand: Array<Card>;
    isJudge: boolean;
    score: number;
    socketUrl: any;
}

