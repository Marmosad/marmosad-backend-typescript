var Rx = require('rxjs');
import Board from '../board';

class RxService {

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

export default new RxService();