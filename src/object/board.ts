import {inject, injectable} from "inversify";
import {SocketService} from "../service/socketService";
import {Deck} from "./deck";
import {BoardDisplay, BoardInfo} from "./boardComponent";
import {BoardEventHandler} from "../handler/boardEventHandler";
import {
    ConnectionEvent,
    JudgementEvent,
    RxEvents,
    RxEventsInterface,
    SubmissionEvent
} from "../interface/rxEventInterface";
import {Player} from "./player";
import {Card} from "../interface/firestoreInterface";

@injectable()
class Board {
    private eventHandlerStarted = false;
    private _info: BoardInfo;
    private display: BoardDisplay;
    private players: Map<string, Player> = new Map<string, Player>();
    @inject(SocketService) private socket: SocketService;
    @inject(Deck) private deck: Deck;

    constructor(private _eventHandler: BoardEventHandler) {
        this.startEventHandler();
    }

    public startEventHandler() {
        if (this.eventHandlerStarted)
            return;
        this.eventHandler.subscribe((next: RxEventsInterface) => {
            switch (next.event) {
                case RxEvents.playedWhiteCard:
                    this.playWhiteCard(next.eventData as SubmissionEvent);
                    break;
                case RxEvents.judgedSubmission:
                    this.judgedSubmission(next.eventData as JudgementEvent);
                    break;
                case RxEvents.playerConnect:
                    this.playerConnect(next.eventData as ConnectionEvent).then(this.updateDisplay);
                    break;
                case RxEvents.playerDisconnect:
                    this.playerDisconnect(next.eventData as ConnectionEvent);
                    break;
                default:
                    break;

            }
        });
        this.eventHandlerStarted = true;
    }

    set info(bi: BoardInfo) {
        this._info = bi;
        // TODO: The initialize below should take a list of card packs from board info, when they exist.
        this.deck.initialize();
    }

    get info(): BoardInfo {
        return this._info
    }

    get eventHandler(): BoardEventHandler {
        return this._eventHandler;
    }
    public startSocket(url = this.info.socketUrl) {
        this.socket.start(url);
    }

    public async initDeck(cardPack: string[]) {
        await this.deck.initialize(cardPack);
    }

    public playWhiteCard(eventData: SubmissionEvent) {

    }

    public judgedSubmission(eventData: JudgementEvent) {

    }

    public async playerConnect(eventData: ConnectionEvent) {
        const newPlayer = new Player(eventData.socketUrl, eventData.playerName);
        console.log('[DBG] player added as ', eventData);
        while (newPlayer.hand.length < 7){
            const newCard = await this.deck.drawWhiteCard();
            console.log('[DBG] attempting to add new card to player ', newCard);
            newPlayer.fillHand(newCard as Card);
        }
        console.log('[EVENT] new player added: ', newPlayer);
        this.players.set(newPlayer.playerName, newPlayer as Player);
        return;
    }
    public playerDisconnect(eventData: ConnectionEvent) {

    }

    public updateDisplay() {

    }

    public getPlayer(name:string){
        return this.players.get(name);
    }
}

export default Board;
