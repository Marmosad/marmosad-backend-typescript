import jsonHandler from './jsonHandler'
import rxService from '../dataServices/rxService'
var playerSubject = rxService.getPlayerSubject()
//rewrite as module in typescript
class PlayerHandler {
    createPlayer (playerName, socket, socketid) {
        jsonHandler.createPlayer(function (hand) {
            playerSubject.next({
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

export default new PlayerHandler();