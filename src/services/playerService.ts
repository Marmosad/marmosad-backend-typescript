import { jsonService, rxService } from '../barrels/services'

var playerSubject = rxService.getPlayerSubject()
//rewrite as module in typescript
export default class PlayerService {
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