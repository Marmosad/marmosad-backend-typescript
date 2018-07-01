"use strict";
exports.__esModule = true;
var Rx = require('rxjs');
var playerSubject = new Rx.Subject();
var blackCardSubject = new Rx.Subject();
var whiteCardSubject = new Rx.Subject();
var rxService = /** @class */ (function () {
    function rxService() {
    }
    rxService.prototype.getPlayerSubject = function () {
        return playerSubject;
    };
    rxService.prototype.getBlackCardSubject = function () {
        return blackCardSubject;
    };
    rxService.prototype.getWhiteCardSubject = function () {
        return whiteCardSubject;
    };
    return rxService;
}());
exports["default"] = new rxService();
