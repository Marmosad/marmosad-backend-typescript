import { PlayerData } from "./playerModel";

export class BoardInfo {
    name: string;
    numberOfPlayers: number;
    socketUrl: string;
    playerLimitReached: boolean;
    playerLimit: number;
    instanceId: InstanceId = generateInstanceId();
}

export type InstanceId = Date; 
function generateInstanceId(): InstanceId {
    return new Date;
}

export class BoardDisplay {
    blackCard: any = null; //This should be a black card object
    submissions: Array<any> = [];
    currentJudge: string = ''; // The player ID of the person who is the judge
    players: Array<any> = [];
}

export enum Phases {
    startGame = 0,
    submission = 1,
    judgement = 2,
    updateScore = 3,
    four = 4,
    endGame = 5
}