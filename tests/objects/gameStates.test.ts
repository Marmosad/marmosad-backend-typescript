import {GameState} from "../../src/object/gameState";
import {State} from "../../src/interface/boardInterface";
import * as jest from "ts-jest";
console.log('Testing on jest ' + jest.version);


describe("Game State", ()=>{
    let gs = new GameState();
    it('should set state to startGame', function () {
        const state = State.startGame;
        gs.gameState = state;
        expect(gs.gameState).toEqual(state)
    });
    it('should set state to submission', function () {
        const state = State.submission;
        gs.gameState = state;
        expect(gs.gameState).toEqual(state)
    });
    it('should set state to judgment', function () {
        const state = State.judgment;
        gs.gameState = state;
        expect(gs.gameState).toEqual(state)
    });
    it('should set state to endGame', function () {
        const state = State.endGame;
        gs.gameState = state;
        expect(gs.gameState).toEqual(state)
    });
    it('should set state to dealNewCards', function () {
        const state = State.dealNewCards;
        gs.gameState = state;
        expect(gs.gameState).toEqual(state)
    });
    it('should set state to updateScore', function () {
        const state = State.updateScore;
        gs.gameState = state;
        expect(gs.gameState).toEqual(state)
    });
});
