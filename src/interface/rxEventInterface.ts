import {DealtCard} from "./playerInterface";

export interface RxEventsInterface {
    event: RxEvents;
    eventData: ConnectionEvent | SubmissionEvent | JudgementEvent | EndGameEvent;
};

export interface ConnectionEvent {
    playerName: string;
    socketUrl: string;
}

export interface EndGameEvent {
    playerName: string;
    socketUrl: string;
}

export interface SubmissionEvent extends ConnectionEvent {
    cardPack: string;
    card: DealtCard;
}

export interface JudgementEvent extends ConnectionEvent {
    cardPack: string;
    card: DealtCard;
    owner: string;
    ownerUrl: string;
}

export enum RxEvents {
    startGame = 5,
    playerConnect = 0,
    playerDisconnect = 3,
    playedWhiteCard = 1,
    judgedSubmission = 2,
    gameEnded = 69
}
