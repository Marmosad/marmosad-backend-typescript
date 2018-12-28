import {inject, injectable} from "inversify";
import {SocketService} from "../service/socketService";
import {Deck} from "./deck";
import {BoardDisplay, BoardInfo, PlayerDisplay, Score} from "./boardComponent";
import {BoardEventHandler} from "../handler/boardEventHandler";
import {
    ConnectionEvent,
    EndGameEvent,
    JudgementEvent,
    RxEvents,
    RxEventsInterface,
    SubmissionEvent
} from "../interface/rxEventInterface";
import {Player} from "./player";
import {Card} from "../interface/firestoreInterface";
import {MAX_SCORE, State} from "../interface/boardInterface";
import {DealtCard} from "../interface/playerInterface";

@injectable()
class Board {
    get players(): Map<string, Player> {
        return this._players;
    }

    private eventHandlerStarted = false;
    private _info: BoardInfo;
    private readonly display: BoardDisplay;
    private _players: Map<string, Player> = new Map<string, Player>();
    @inject(SocketService) private socket: SocketService;
    @inject(Deck) private deck: Deck;

    constructor(private _eventHandler: BoardEventHandler) {
        this.startEventHandler();
        this.display = {blackCard: null, currentJudge: '', submissions: []} as BoardDisplay;
    }

    public startEventHandler() {
        if (this.eventHandlerStarted)
            return;
        this.eventHandler.subscribe(async (next: RxEventsInterface) => {
            switch (next.event) {
                case RxEvents.playedWhiteCard:
                    this.playWhiteCard(next.eventData as SubmissionEvent);
                    break;
                case RxEvents.judgedSubmission:
                    await this.judgedSubmission(next.eventData as JudgementEvent);
                    break;
                case RxEvents.playerConnect:
                    await this.playerConnect(next.eventData as ConnectionEvent);
                    break;
                case RxEvents.playerDisconnect:
                    this.playerDisconnect(next.eventData as ConnectionEvent);
                    break;
                case RxEvents.startGame:
                    this.updateDisplay(this.players);
                    break;
                default:
                    break;
            }
            this.updateDisplay(this.players);
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
        this.socket.start(url, this.eventHandler.emitEvent);
    }

    public async initDeck(cardPack: string[]) {
        await this.deck.initialize(cardPack);
    }

    public playWhiteCard(eventData: SubmissionEvent) {
        const playerName = eventData.playerName;
        if (playerName !== this.display.currentJudge && !this.players.get(playerName).hasPlayed)
            return;
        this.display.submissions.push({cardId: eventData.card.cardId, body: eventData.card.body, owner: playerName});
        this.players.get(playerName).hasPlayed = true;
        // remove card from player hand
        this.players.get(playerName).hand.splice(this.players.get(playerName).hand.indexOf(eventData.card), 1);
    }

    private dealCard(card: Card, owner: string): DealtCard {
        return {cardId: card.cardId, body: card.body, owner: owner};
    }

    public async judgedSubmission(eventData: JudgementEvent) {
        const playerName = eventData.playerName;
        const owner = eventData.owner;
        if (playerName === this.display.currentJudge)
            return;
        this.players.get(owner).score++;
        if (this.players.get(owner).score > MAX_SCORE) { // This variable dictates how long the games go oops.
            this.eventHandler.gameState = State.endGame;
            this.endGame(owner);
        } else {
            this.eventHandler.gameState = State.dealNewCards;
            await this.dealNewCards();
        }
    }

    public async playerConnect(eventData: ConnectionEvent) {
        const newPlayer = new Player(eventData.socketUrl, eventData.playerName);
        console.log('[DBG] player added as ', eventData);
        await this.fillPlayerHand(newPlayer);
        this.players.set(eventData.playerName, newPlayer as Player);
        this.info.numberOfPlayers += 1;
        console.log('[EVENT] new player added: ', this.players.get(eventData.playerName));
        return;
    }

    private async fillPlayerHand(player: Player) {
        while (player.hand.length < 7) {
            const newCard = await this.deck.drawWhiteCard();
            console.log('[DBG] attempting to add new card to player ', newCard);
            player.fillHand(this.dealCard(newCard as Card, player.playerName));
        }
    }

    public playerDisconnect(eventData: ConnectionEvent) {
        this.info.numberOfPlayers -= 1;
        this.players.delete(eventData.playerName);
    }

    public updateDisplay(players) {
        let score = [];
        players.forEach((value, key) => {
            score.push({playerName: value.playerName, isJudge: value.isJudge, score: value.score} as Score);
        });
        players.forEach((value, key) => {
            const playerDisplay = this.display as PlayerDisplay;
            playerDisplay.playerHand = this.players.get(key).hand;
            playerDisplay.score = score;
            console.log('[EVENT] Update pushed with', key, playerDisplay as PlayerDisplay);
            this.socket.emitDisplayUpdate(key, playerDisplay as PlayerDisplay)
        })
    }

    public getPlayer(name: string) {
        return this.players.get(name);
    }

    public endGame(playerName: string): void {
        this.eventHandler.emitEvent({
            event: RxEvents.gameEnded,
            eventData: {playerName: playerName} as EndGameEvent
        } as RxEventsInterface);
    }

    public async dealNewCards() {
        this.display.blackCard = await this.deck.drawBlackCard();
        this.display.submissions = [] as DealtCard[];
        this.players.forEach(async (value) => {
            await this.fillPlayerHand(value);
        })
    }
}

export default Board;
