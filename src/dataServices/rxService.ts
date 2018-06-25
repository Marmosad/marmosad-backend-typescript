var Rx = require('rxjs');
import board from '../board';
var playerSubject = new Rx.Subject();
var blackCardSubject = new Rx.Subject();
var whiteCardSubject = new Rx.Subject();

class rxService {

    getPlayerSubject () {
        return playerSubject
    }
    
    getBlackCardSubject () {
        return blackCardSubject;
    }
    
    getWhiteCardSubject () {
        return whiteCardSubject;
    }
}

export default new rxService();