var Rx = require('rxjs');

export default class RxHandler {

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