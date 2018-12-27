import {Card} from "../interface/firestoreInterface";

export interface BoardInfo {
    readonly cardPacks: string[];
    readonly name: string;
    numberOfPlayers: number;
    playerLimitReached: boolean;
    readonly playerLimit: number;
    readonly socketUrl: string;
}

export interface BoardDisplay {
    blackCard: any; //This should be a black card object
    submissions: Array<Card>;
    currentJudge: string; // The player ID of the person who is the judge
}

export interface PlayerDisplay extends BoardDisplay{
    playerHand: Array<Card>;
}