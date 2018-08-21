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
var board_1 = require("../board");
var boardModel_1 = require("../models/boardModel");
var inversify_1 = require("inversify");
var app_1 = require("../../app");
var types_1 = require("../models/types");
var BoardService = /** @class */ (function () {
    function BoardService(_jsonService) {
        var _this = this;
        this.boards = new Array();
        this.jsonService = _jsonService;
        setTimeout(function () {
            _this.newBoard('Board 1', 3);
            _this.newBoard('Board 2', 3);
            _this.newBoard('Board 3', 3);
        }, 1000);
    }
    BoardService.prototype.newBoard = function (name, playerLimit) {
        var boards = this.getBoardsInfo();
        var repeating = false;
        var boardInfo = Object.assign(new boardModel_1.BoardInfo(), {
            name: name,
            playerLimit: playerLimit,
            socketUrl: name,
            numberOfPlayers: 0,
            playerLimitReached: false
        });
        var boardInstance = new board_1.default(boardInfo, app_1.appInstance, this.jsonService);
        this.boards.push(boardInstance);
        return boardInstance;
    };
    BoardService.prototype.updateBoard = function (socketUrl, newPlayerLimit, newName) {
        this.boards.forEach(function (board) {
            if (board.boardInfo.socketUrl === socketUrl) {
                board.updateBoardInfo(Object.assign(board.boardInfo, {
                    name: newName,
                    playerLimit: newPlayerLimit,
                }));
                board.socketHandler.emit('boardReset', null);
                board.reset;
            }
        });
    };
    BoardService.prototype.removeBoard = function (socketUrl) {
        var _this = this;
        this.boards.forEach(function (board) {
            if (board.boardInfo.socketUrl === socketUrl) {
                board.socketHandler.emit('boardReset', null);
                var playerKeys = Object.keys(board.getPlayers());
                playerKeys.forEach(function (playerId) {
                    board.removePlayer(playerId);
                    board.boardInfo = null;
                    _this.boards.splice(_this.boards.indexOf(board), 1);
                });
            }
        });
    };
    BoardService.prototype.getBoardInfo = function (socketUrl) {
        // console.log(this.getBoardsInfo());
        return this.getBoardsInfo().find(function (boardInfo) {
            return boardInfo.socketUrl === socketUrl;
        });
    };
    BoardService.prototype.getBoardsInfo = function () {
        var result = new Array();
        this.boards.forEach(function (board) {
            var data = board.boardInfo;
            result.push(data);
        });
        return result;
    };
    BoardService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.JsonInterface)),
        __metadata("design:paramtypes", [Object])
    ], BoardService);
    return BoardService;
}());
exports.BoardService = BoardService;
exports.default = BoardService;
