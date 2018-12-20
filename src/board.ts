import {BoardInfo} from "./models/boardModel";
import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {SocketService} from "./services/socketServices";

@injectable()
class Board {
    private _info: BoardInfo;
    @inject(SocketService) private socket: SocketService;

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
