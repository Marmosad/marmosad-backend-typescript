var mysql = require('mysql');

class dbService {

    connection;
    whiteCardsSize = -1;
    blackCardsSize = -1;

    start () {
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
            console.log('connected as id ' + this.connection.threadId);
            this.connection.query('SELECT COUNT(*) FROM whitecards', function (err, results, fields) {
                if (err) throw err;
                this.whiteCardsSize = results[0]["COUNT(*)"];
                this.connection.query('SELECT COUNT(*) FROM blackcards', function (err, results, fields) {
                    if (err) throw err;
                    this.blackCardsSize = results[0]["COUNT(*)"];
                    this.status = 0;
                });
            });
        });
    }
    getWhiteCard(id, callback) {
        this.connection.query('SELECT * FROM whitecards WHERE id = ' + id, function (err, results, fields) {
            if (err) throw err;
            console.log("white card id is" + id);
            callback(results[0]);
        });
    }
    getBlackCard (id, callback) { //gets rand black card
        this.connection.query('SELECT * FROM `blackcards` WHERE `﻿id`='+id, function (err, results, fields) {
            if (err) throw err;
            console.log("blackcard id is" + id);
            callback(results[0]);
        });
    }
    getWhiteCardSize () {
        return this.whiteCardsSize;
    }
    getBlackCardSize () {
        return this.blackCardsSize;
    }
}

export default new dbService();