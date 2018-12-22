import {BoardInfo} from "../Interface/boardInterface";
import {inject, injectable} from "inversify";
import {Socket} from "socket.io";
import {SocketService} from "../service/socketService";
import {Deck} from "./deck";
import {Subject} from "rxjs";

@injectable()
class Board {
    private _info: BoardInfo;
    @inject(SocketService) private socket: SocketService;
    @inject(Deck) private deck: Deck;
    private boardSubject: Subject<any> = new Subject<any>();
    constructor(){
    }

    set info(bi: BoardInfo) {
        this._info = bi;
        // TODO: The initialize below should take a list of card packs from board info, when they exist.
        this.deck.initialize();
    }

    get info(): BoardInfo {
        return this._info
    }

    public startSocket(url = this.info.socketUrl) {
        this.socket.start(url);
    }
}

export default Board;
