import {BoardInfo} from "../Interface/boardInterface";
import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {SocketService} from "../service/socketService";
import {Deck} from "./deck";

@injectable()
class Board {
    private _info: BoardInfo;
    @inject(SocketService) private socket: SocketService;
    @inject(Deck) private deck: Deck;

    set info(bi: BoardInfo) {
        this._info = bi;
    }

    get info(): BoardInfo {
        return this._info
    }

    public startSocket(url = this.info.socketUrl) {
        this.socket.start(url);
    }
}

export default Board;
