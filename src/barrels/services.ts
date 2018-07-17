import RxService from '../services/rxService';
const rxService = new RxService();

import DbService from '../services/dbService';
const dbService = new DbService();

import PlayerService from '../services/playerService';
const playerService = new PlayerService();

import JsonService from '../services/jsonService';
const jsonService = new JsonService();

export {
    rxService,
    dbService,
    playerService,
    jsonService
}