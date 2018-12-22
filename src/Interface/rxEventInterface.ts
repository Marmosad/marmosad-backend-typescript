export interface RxEventsInterface {
    event: rxEvents;
    eventData: ConnectionEvent;
}

export interface ConnectionEvent {
    playerName: string;
    socketUrl: string;
}

export enum rxEvents {
    playerConnect,
    playerDisconnect,
}