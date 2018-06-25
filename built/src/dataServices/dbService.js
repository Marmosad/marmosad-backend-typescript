"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql = require('mysql');
var connection;
var whiteCardsSize = -1;
var blackCardsSize = -1;
var status = -1;
var board = require('../board.js');
var dbService = /** @class */ (function () {
    function dbService() {
    }
    dbService.prototype.start = function () {
        connection = mysql.createConnection({
            host: "35.203.14.127",
            user: "root",
            password: "marmoExtraSad3",
            database: 'cah'
        });
        connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + connection.threadId);
            connection.query('SELECT COUNT(*) FROM whitecards', function (err, results, fields) {
                if (err)
                    throw err;
                whiteCardsSize = results[0]["COUNT(*)"];
                connection.query('SELECT COUNT(*) FROM blackcards', function (err, results, fields) {
                    if (err)
                        throw err;
                    blackCardsSize = results[0]["COUNT(*)"];
                    this.status = 0;
                });
            });
        });
    };
    dbService.prototype.getWhiteCard = function (id, callback) {
        connection.query('SELECT * FROM whitecards WHERE id = ' + id, function (err, results, fields) {
            if (err)
                throw err;
            console.log("white card id is" + id);
            callback(results[0]);
        });
    };
    dbService.prototype.getBlackCard = function (id, callback) {
        connection.query('SELECT * FROM `blackcards` WHERE `﻿id`=' + id, function (err, results, fields) {
            if (err)
                throw err;
            console.log("blackcard id is" + id);
            callback(results[0]);
        });
    };
    dbService.prototype.getWhiteCardSize = function () {
        return whiteCardsSize;
    };
    dbService.prototype.getBlackCardSize = function () {
        return blackCardsSize;
    };
    return dbService;
}());
exports.default = new dbService();
