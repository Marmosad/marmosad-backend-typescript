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
// import { dbService, rxService } from '../barrels/services';
var inversify_1 = require("inversify");
var types_1 = require("../models/types");
var jsonModel_1 = require("../models/jsonModel");
var rxHandler_1 = require("../handlers/rxHandler");
var JsonService = /** @class */ (function () {
    function JsonService(_dbService) {
        this.dbService = _dbService;
        this.dbService.start();
    }
    JsonService.prototype.createPlayer = function (callback, playerId) {
        var self = this;
        var hand = [];
        function recursion(card) {
            // console.log(card);
            var whiteCard = new jsonModel_1.WhiteCardModel();
            whiteCard = {
                cardId: card.id,
                body: card.body,
                owner: playerId
            };
            // console.log(whiteCard);
            hand.push(whiteCard);
            if (hand.length !== 7) {
                self.dbService.getWhiteCard(rxHandler_1.getRandomInt(1, self.dbService.whiteCardsSize), recursion);
            }
            else {
                callback(hand);
            }
        }
        this.dbService.getWhiteCard(rxHandler_1.getRandomInt(1, this.dbService.whiteCardsSize), recursion);
    };
    JsonService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.DbInterface)),
        __metadata("design:paramtypes", [Object])
    ], JsonService);
    return JsonService;
}());
exports.JsonService = JsonService;
