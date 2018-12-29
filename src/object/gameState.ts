import {State} from "../interface/boardInterface";

export class GameState {
    get gameState(): State {
        return this._gameState;
    }

    set gameState(value: State) {
        this._gameState = value;
    }

    private _gameState: State;

    constructor() {
        this._gameState = State.startGame;
    }
}