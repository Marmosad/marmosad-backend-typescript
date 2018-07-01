var Rx = require('rxjs');
import board from '../board';

class rxService {

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

export default new rxService();