import {injectable} from "inversify";

@injectable()
export class BoardInfo {
    cardPacks: string[];
    name: string;
    numberOfPlayers: number;
    playerLimitReached: boolean;
    playerLimit: number;
    socketUrl: string;
}
export class BoardDisplay {
    blackCard: any = null; //This should be a black card object
    submissions: Array<any> = [];
    currentJudge: string = ''; // The player ID of the person who is the judge
    players: Array<any> = [];
}

export const PLAYER_COUNT_UPPER_BOUND = 8;
export const PLAYER_COUNT_LOWER_BOUND = 3;


export enum Phases {
    startGame = 0,
    submission = 1,
    judgement = 2,
    updateScore = 3,
    four = 4,
    endGame = 5
}