import {BoardInfo} from "./models/boardModel";
import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {SocketService} from "./services/socketServices";
import {Http} from "./services/httpSingletonService";

@injectable()
class Board {
    private _info: BoardInfo;

    constructor(@inject(SocketService) private socket: SocketService) {
    }

    set info(bi: BoardInfo) {
        this._info = bi;
    }

    get info(): BoardInfo {
        return this._info
    }

    public startSocket() {
        this.socket.start('a');
        console.log('[DBG] socket started at ' + this.info.socketUrl);
    }
}

export default Board;
