import {GameState} from "../object/gameState";
import {State} from "./boardInterface";
import {Card} from "./firestoreInterface";

export interface RxEventsInterface {
    event: RxEvents;
    eventData: ConnectionEvent | SubmissionEvent | JudgementEvent;
};

export interface ConnectionEvent {
    playerName: string;
    socketUrl: string;
}

export interface SubmissionEvent extends ConnectionEvent{
    cardPack: string;
    card: Card;
}

export interface JudgementEvent extends ConnectionEvent{
    cardPack: string;
    card: Card;
    owner: string;
    ownerUrl: string;
}

export enum RxEvents {
    playerConnect = 0,
    playerDisconnect = 0,
    playedWhiteCard = 1,
    judgedSubmission = 2,
}