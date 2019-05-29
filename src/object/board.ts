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
    get display(): BoardDisplay {
        return this._display;
    }

    public eventHandlerStarted = false;

    private _info: BoardInfo;
    private readonly _display: BoardDisplay;
    private _players: Map<string, Player> = new Map<string, Player>();
    @inject(SocketService) private socket: SocketService;
    @inject(Deck) private deck: Deck;

    constructor(private _eventHandler: BoardEventHandler) {
        this._display = {blackCard: null, currentJudge: '', submissions: []} as BoardDisplay;
        this.startEventHandler();
    }

    public startEventHandler() {
        if (this.eventHandlerStarted)
            return;
        this.eventHandler.subscribe(async (next: RxEventsInterface) => {
            switch (next.event) {
                case RxEvents.playedWhiteCard:
                    this.playWhiteCard(next.eventData as SubmissionEvent);
                    if (this.display.submissions.length >= (this.info.numberOfPlayers - 1)) {
                        this.eventHandler.gameState = State.judgment;
                    }
                    break;
                case RxEvents.judgedSubmission:
                    await this.judgedSubmission(next.eventData as JudgementEvent);
                    await this.dealNewCards();
                    this.eventHandler.gameState = State.submission;
                    break;
                case RxEvents.playerConnect:
                    await this.playerConnect(next.eventData as ConnectionEvent);
                    break;
                case RxEvents.playerDisconnect:
                    await this.playerDisconnect(next.eventData as ConnectionEvent);
                    break;
                case RxEvents.startGame:
                    await this.dealNewCards();
                    this.eventHandler.gameState = State.submission;
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
        if (this.players.get(playerName) == null || eventData.card.owner !== playerName) {
            console.log('[WARNING] Card played by incorrect owner');
            return;
        }
        if (playerName === this._display.currentJudge || this.players.get(playerName).hasPlayed) {
            console.log(playerName === this._display.currentJudge);
            console.log(this.players.get(playerName).hasPlayed);
            return;
        }
        console.log('[EVENT] Card played by', eventData.playerName);

        this._display.submissions.push({cardId: eventData.card.cardId, body: eventData.card.body, owner: playerName});
        this.players.get(playerName).hasPlayed = true;
        // remove card from player hand
        this.players.get(playerName).removeCard(eventData.card);
    }

    public static dealCard(card: Card, owner: string): DealtCard {
        return {cardId: card.cardId, body: card.body, owner: owner};
    }

    public async judgedSubmission(eventData: JudgementEvent) {
        const owner = eventData.owner;
        if (owner === this._display.currentJudge)
            return;
        this.players.get(owner).score++;
        if (this.players.get(owner).score > MAX_SCORE) { // This variable dictates how long the games go oops.
            this.eventHandler.gameState = State.endGame;
            this.endGame(owner);
        }
    }

    public async playerConnect(eventData: ConnectionEvent) {
        const newPlayer = new Player(eventData.socketUrl, eventData.playerName);
        console.log('[DBG] player added as ', eventData);
        await this.fillPlayerHand(newPlayer);
        this.players.set(eventData.playerName, newPlayer as Player);
        this.info.numberOfPlayers++;
        console.log('[EVENT] new player added: ', this.players.get(eventData.playerName));
        return;
    }

    private async fillPlayerHand(player: Player) {
        while (player.hand.length < 7) {
            const newCard = await this.deck.drawWhiteCard();
            player.fillHand(Board.dealCard(newCard as Card, player.playerName));
        }
    }

    public playerDisconnect(eventData: ConnectionEvent) {
        if (!this.players.has(eventData.playerName))
            return;
        this.info.numberOfPlayers --;
        this.players.delete(eventData.playerName);
        if (this.info.numberOfPlayers <= 0)
            this.endGame(eventData.playerName);
    }

    public updateDisplay(players) {
        let score = [];
        players.forEach((value, key) => {
            score.push({playerName: value.playerName, isJudge: value.isJudge, score: value.score} as Score);
        });
        players.forEach((value, key) => {
            const playerDisplay = this._display as PlayerDisplay;
            playerDisplay.playerHand = this.players.get(key).hand;
            playerDisplay.score = score;
            console.log('[EVENT] Display update');
            this.socket.emitDisplayUpdate(key, playerDisplay as PlayerDisplay)
        })
    }

    get players(): Map<string, Player> {
        return this._players;
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
        this.display.currentJudge = this.selectNextJudge();
        this.players.forEach(async (value) => {
            await this.fillPlayerHand(value);
            value.hasPlayed = false;
            this.updateDisplay(this.players);
        })
    }

    public selectNextJudge(): string {
        let playerIterator = this.players.keys();
        let nextJudge;
        while (nextJudge != this.display.currentJudge) { // this will not run if current judge is undefined.
            nextJudge = playerIterator.next().value;
            if (nextJudge == undefined) {
                break;
            }
        }
        nextJudge = playerIterator.next().value;
        if (nextJudge != undefined) {
            return nextJudge;
        }
        return this.players.keys().next().value;
    }

    public empty(): boolean {
        // returns true iff no players
        return (!this.info.numberOfPlayers);
    }

}

export default Board;
