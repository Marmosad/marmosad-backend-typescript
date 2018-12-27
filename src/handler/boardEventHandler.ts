import {RxEventsInterface} from "../interface/rxEventInterface";
import {State} from "../interface/boardInterface";
import {Subject} from "rxjs";
import {injectable} from "inversify";

@injectable()
export class BoardEventHandler {
    get gameState(): State {
        return this._gameState;
    }

    set gameState(value: State) {
        this._gameState = value;
    }
    private _subject: Subject<RxEventsInterface>;
    private _gameState: State;

    constructor() {
        this._gameState = State.startGame;
        this._subject = new Subject()
    }

    public subscribe = (arg) => {
        return this._subject.subscribe(arg);
    };

    public emitEvent = (gameEvent: RxEventsInterface) => {
        // if game ended ignore everything
        if (this.gameState == State.endGame)
            return;
        if (this.gameState as number == gameEvent.event as number) {
            this._subject.next(gameEvent as RxEventsInterface);
            console.log("[EVENT] accepted ", gameEvent );
        }
        else {
            console.log("[EVENT] rejected ", gameEvent );
        }
    };
}