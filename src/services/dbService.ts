var mysql = require('mysql');
import { interfaces, injectable, inject } from "inversify";
import { EnvInterface } from './envService';
import { TYPES } from "../models/types";

export interface DbInterface {
    start(): void;
    getWhiteCard(id, callback): void;
    getBlackCard(id, callback): void;
    whiteCardsSize: number;
    blackCardsSize: number; 
}

@injectable()
export class DbService implements DbInterface{

    private envService: EnvInterface;
    private connection: any;
    private _whiteCardsSize = -1;
    private _blackCardsSize = -1;
    
    constructor(
        @inject(TYPES.EnvInterface) _envService: EnvInterface
    ) {
        this.envService = _envService;
    }

    start (): void {
        let self = this;
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
                if (err) throw err;
                self._whiteCardsSize = results[0]["COUNT(*)"];
                self.connection.query('SELECT COUNT(*) FROM blackcards', function (err, results, fields) {
                    if (err) throw err;
                    self._blackCardsSize = results[0]["COUNT(*)"];
                    this.status = 0;
                });
            });
        });
    }
    getWhiteCard(id, callback): void {
        this.connection.query('SELECT * FROM whitecards WHERE id = ' + id, function (err, results, fields) {
            if (err) throw err;
            console.log("white card id is" + id);
            callback(results[0]);
        });
    }
    getBlackCard (id, callback): void { //gets rand black card
        this.connection.query('SELECT * FROM `blackcards` WHERE `﻿id`='+id, function (err, results, fields) {
            if (err) throw err;
            console.log("blackcard id is" + id);
            callback(results[0]);
        });
    }
    get whiteCardsSize (): number {
        return this._whiteCardsSize;
    }
    get blackCardsSize (): number {
        return this._blackCardsSize;
    }
}
