"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require('mysql');
var dbService = /** @class */ (function () {
    function dbService() {
        this.whiteCardsSize = -1;
        this.blackCardsSize = -1;
    }
    dbService.prototype.start = function () {
        var self = this;
        this.connection = mysql.createConnection({
            host: "35.203.14.127",
            user: "root",
            password: "marmoExtraSad3",
            database: 'cah'
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
                self.whiteCardsSize = results[0]["COUNT(*)"];
                self.connection.query('SELECT COUNT(*) FROM blackcards', function (err, results, fields) {
                    if (err)
                        throw err;
                    self.blackCardsSize = results[0]["COUNT(*)"];
                    this.status = 0;
                });
            });
        });
    };
    dbService.prototype.getWhiteCard = function (id, callback) {
        this.connection.query('SELECT * FROM whitecards WHERE id = ' + id, function (err, results, fields) {
            if (err)
                throw err;
            console.log("white card id is" + id);
            callback(results[0]);
        });
    };
    dbService.prototype.getBlackCard = function (id, callback) {
        this.connection.query('SELECT * FROM `blackcards` WHERE `﻿id`=' + id, function (err, results, fields) {
            if (err)
                throw err;
            console.log("blackcard id is" + id);
            callback(results[0]);
        });
    };
    dbService.prototype.getWhiteCardSize = function () {
        return this.whiteCardsSize;
    };
    dbService.prototype.getBlackCardSize = function () {
        return this.blackCardsSize;
    };
    return dbService;
}());
exports.default = new dbService();
