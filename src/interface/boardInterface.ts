export const PLAYER_COUNT_UPPER_BOUND = 8;
export const PLAYER_COUNT_LOWER_BOUND = 3;


export enum State {
    startGame = 0,
    submission = 1,
    judgement = 2,
    updateScore = 3,
    dealNewCards = 4,
    endGame = 5
}