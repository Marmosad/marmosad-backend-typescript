// import { jsonService, rxService } from '../barrels/services'
import { interfaces, injectable, inject } from "inversify";
import { TYPES } from "../models/types";
import { JsonInterface } from "./jsonService";
import { RxInterface } from "./rxService";

export interface PlayerInterface {
    createPlayer(playerName, socket, socketid);
}

//rewrite as module in typescript
@injectable()
export class PlayerService implements PlayerInterface {
    private jsonService: JsonInterface;
    private rxService: RxInterface;
    private playerSubject: any;

    constructor(
        @inject(TYPES.JsonInterface) _jsonService: JsonInterface,
        @inject(TYPES.RxInterface) _rxService: RxInterface
    ) {
        this.jsonService = _jsonService;
        this.rxService = _rxService;
        this.playerSubject = this.rxService.getPlayerSubject()
    }

    createPlayer (playerName, socket, socketid) {
        this.jsonService.createPlayer(function (hand) {
            this.playerSubject.next({
                data: {
                    "playerName": playerName,
                    "playerId": socketid,
                    "hand": hand,
                    "isJudge": false, // Do we still need this field? I think the currentJudge in display is good enough?
                    "score": 0
                },
                socket: socket
            });
        }, socketid);
    }
}
