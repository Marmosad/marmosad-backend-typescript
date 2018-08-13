"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { jsonService, rxService } from '../barrels/services'
var inversify_1 = require("inversify");
var types_1 = require("../models/types");
//rewrite as module in typescript
var PlayerService = /** @class */ (function () {
    function PlayerService(_jsonService, _rxService) {
        this.jsonService = _jsonService;
        this.rxService = _rxService;
        this.playerSubject = this.rxService.getPlayerSubject();
    }
    PlayerService.prototype.createPlayer = function (playerName, socket, socketid) {
        var self = this;
        this.jsonService.createPlayer(function (hand) {
            self.playerSubject.next({
                data: {
                    "playerName": playerName,
                    "playerId": socketid,
                    "hand": hand,
                    "isJudge": false,
                    "score": 0
                },
                socket: socket
            });
        }, socketid);
    };
    PlayerService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.JsonInterface)),
        __param(1, inversify_1.inject(types_1.TYPES.RxInterface)),
        __metadata("design:paramtypes", [Object, Object])
    ], PlayerService);
    return PlayerService;
}());
exports.PlayerService = PlayerService;
