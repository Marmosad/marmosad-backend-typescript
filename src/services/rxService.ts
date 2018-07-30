var Rx = require('rxjs');
import { interfaces, injectable, inject } from "inversify";

export interface RxInterface {
    getPlayerSubject(): any;
    getBlackCardSubject(): any;
    getWhiteCardSubject(): any;                    
}

@injectable()
export class RxService implements RxInterface {

    playerSubject = new Rx.Subject();
    blackCardSubject = new Rx.Subject();
    whiteCardSubject = new Rx.Subject();

    constructor() {
    }

    getPlayerSubject (): any {
        return this.playerSubject
    }
    
    getBlackCardSubject (): any {
        return this.blackCardSubject;
    }
    
    getWhiteCardSubject (): any {
        return this.whiteCardSubject;
    }
}