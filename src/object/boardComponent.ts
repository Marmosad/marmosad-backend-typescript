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
}