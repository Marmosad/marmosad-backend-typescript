export const PLAYER_COUNT_UPPER_BOUND = 8;
export const PLAYER_COUNT_LOWER_BOUND = 3;
export const MAX_SCORE = 10;


export enum State {
    startGame = 0,
    submission = 1,
    judgment = 2,
    updateScore = 3,
    dealNewCards = 4,
    endGame = 69
}
