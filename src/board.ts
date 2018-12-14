import {BoardInfo} from "./models/boardModel";
import {inject} from "inversify";

class Board {
    private _info: BoardInfo;
    constructor(info: BoardInfo) {
        this._info = info
    }

    get info(): BoardInfo {
        return this._info
    }
}

export default Board;
