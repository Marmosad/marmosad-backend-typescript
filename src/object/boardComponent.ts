import {Card} from "../interface/firestoreInterface";
import {DealtCard} from "../interface/playerInterface";

export interface BoardInfo {
    readonly cardPacks: string[];
    readonly boardName: string;
    numberOfPlayers: number;
    playerLimitReached: boolean;
    readonly playerLimit: number;
    readonly socketUrl: string;
}

export interface BoardDisplay {
    blackCard: Card; //This should be a black card object
    submissions: Array<DealtCard>;
    currentJudge: string; // The player ID of the person who is the judge
}

export interface PlayerDisplay extends BoardDisplay{
    playerHand: Array<DealtCard>;
    score: Array<Score>
}


export interface Score {
    playerName: string;
    score: number;
    isJudge: boolean;
}
