"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rx = require('rxjs');
var rxService = /** @class */ (function () {
    function rxService() {
        this.playerSubject = new Rx.Subject();
        this.blackCardSubject = new Rx.Subject();
        this.whiteCardSubject = new Rx.Subject();
    }
    rxService.prototype.getPlayerSubject = function () {
        return this.playerSubject;
    };
    rxService.prototype.getBlackCardSubject = function () {
        return this.blackCardSubject;
    };
    rxService.prototype.getWhiteCardSubject = function () {
        return this.whiteCardSubject;
    };
    return rxService;
}());
exports.default = new rxService();
