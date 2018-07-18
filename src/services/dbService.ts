var mysql = require('mysql');
import envService from './envService';
class DbService {

    connection;
    whiteCardsSize = -1;
    blackCardsSize = -1;
    start () {
        let self = this;
        this.connection = mysql.createConnection({
            host: envService.env.DB_HOST,
            user: envService.env.DB_USER,
            password: envService.env.DB_PASSWORD,
            database: envService.env.DB_NAME
        });
        this.connection.connect(function (err) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            }
            console.log('connected as id ' + self.connection.threadId);
            self.connection.query('SELECT COUNT(*) FROM whitecards', function (err, results, fields) {
                if (err) throw err;
                self.whiteCardsSize = results[0]["COUNT(*)"];
                self.connection.query('SELECT COUNT(*) FROM blackcards', function (err, results, fields) {
                    if (err) throw err;
                    self.blackCardsSize = results[0]["COUNT(*)"];
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

const dbService = new DbService();
export default dbService;