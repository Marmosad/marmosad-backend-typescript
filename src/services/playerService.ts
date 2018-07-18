import jsonService from './jsonService';
import rxService from './rxService';

var playerSubject = rxService.getPlayerSubject()
//rewrite as module in typescript
class PlayerService {
    createPlayer (playerName, socket, socketid) {
        jsonService.createPlayer(function (hand) {
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


const playerService = new PlayerService();
export default playerService;