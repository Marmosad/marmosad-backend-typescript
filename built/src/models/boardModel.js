"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BoardInfo = /** @class */ (function () {
    function BoardInfo() {
        this.instanceId = generateInstanceId();
    }
    return BoardInfo;
}());
exports.BoardInfo = BoardInfo;
function generateInstanceId() {
    return new Date;
}
var BoardDisplay = /** @class */ (function () {
    function BoardDisplay() {
        this.blackCard = null; //This should be a black card object
        this.submissions = [];
        this.currentJudge = ''; // The player ID of the person who is the judge
        this.players = [];
    }
    return BoardDisplay;
}());
exports.BoardDisplay = BoardDisplay;
var Phases;
(function (Phases) {
    Phases[Phases["startGame"] = 0] = "startGame";
    Phases[Phases["submission"] = 1] = "submission";
    Phases[Phases["judgement"] = 2] = "judgement";
    Phases[Phases["updateScore"] = 3] = "updateScore";
    Phases[Phases["four"] = 4] = "four";
    Phases[Phases["endGame"] = 5] = "endGame";
})(Phases = exports.Phases || (exports.Phases = {}));
