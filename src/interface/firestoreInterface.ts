export interface FirebaseEndpoints {
    getPack: string;
    getWhiteCard:string;
    getBlackCard:string;
}

export interface Response {
    message: string;
    responseObj: Pack | Card;
}

export interface Pack {
    whiteCardCount: number;
    blackCardCount: number;
    whiteCardStack?: number[];
    blackCardStack?: number[]
}

export interface Card {
    cardId: number;
    body: string;
}