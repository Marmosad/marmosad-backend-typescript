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
var mysql = require('mysql');
var inversify_1 = require("inversify");
var types_1 = require("../models/types");
var DbService = /** @class */ (function () {
    function DbService(_envService) {
        this._whiteCardsSize = -1;
        this._blackCardsSize = -1;
        this.envService = _envService;
    }
    DbService.prototype.start = function () {
        var self = this;
        this.connection = mysql.createConnection({
            host: this.envService.env.DB_HOST,
            user: this.envService.env.DB_USER,
            password: this.envService.env.DB_PASSWORD,
            database: this.envService.env.DB_NAME
        });
        this.connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + self.connection.threadId);
            self.connection.query('SELECT COUNT(*) FROM whitecards', function (err, results, fields) {
                if (err)
                    throw err;
                self._whiteCardsSize = results[0]["COUNT(*)"];
                self.connection.query('SELECT COUNT(*) FROM blackcards', function (err, results, fields) {
                    if (err)
                        throw err;
                    self._blackCardsSize = results[0]["COUNT(*)"];
                    this.status = 0;
                });
            });
        });
    };
    DbService.prototype.getWhiteCard = function (id, callback) {
        this.connection.query('SELECT * FROM whitecards WHERE id = ' + id, function (err, results, fields) {
            if (err)
                throw err;
            console.log("white card id is" + id);
            callback(results[0]);
        });
    };
    DbService.prototype.getBlackCard = function (id, callback) {
        this.connection.query('SELECT * FROM `blackcards` WHERE `﻿id`=' + id, function (err, results, fields) {
            if (err)
                throw err;
            console.log("blackcard id is" + id);
            callback(results[0]);
        });
    };
    Object.defineProperty(DbService.prototype, "whiteCardsSize", {
        get: function () {
            return this._whiteCardsSize;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DbService.prototype, "blackCardsSize", {
        get: function () {
            return this._blackCardsSize;
        },
        enumerable: true,
        configurable: true
    });
    DbService = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.EnvInterface)),
        __metadata("design:paramtypes", [Object])
    ], DbService);
    return DbService;
}());
exports.DbService = DbService;
