var Rx = require('rxjs');
import Board from '../board';
import { interfaces, injectable, inject } from "inversify";

export interface RxInterface {
    getPlayerSubject();
    getBlackCardSubject();
    getWhiteCardSubject();                    
}

@injectable()
export class RxService implements RxInterface {


    playerSubject;
    blackCardSubject;
    whiteCardSubject;

    constructor() {
        this.playerSubject = new Rx.Subject();
        this.blackCardSubject = new Rx.Subject();
        this.whiteCardSubject = new Rx.Subject();
    }

    getPlayerSubject () {
        return this.playerSubject
    }
    
    getBlackCardSubject () {
        return this.blackCardSubject;
    }
    
    getWhiteCardSubject () {
        return this.whiteCardSubject;
    }
}

const rxService = new RxService();
export default rxService;
