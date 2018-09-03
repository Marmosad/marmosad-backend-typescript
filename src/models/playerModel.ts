import { WhiteCardModel } from "./jsonModel";
import { Socket } from "dgram";

export class PlayerData {
    playerName: string;
    playerId: string;
    hand: Array<WhiteCardModel>;
    isJudge: boolean;
    score: number;
}

export class Player {
    data: PlayerData;
    socket: any;
}

export class Players {
    [key: string]: Player;
}
