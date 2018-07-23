import { interfaces, injectable, inject, Container } from "inversify";
import "reflect-metadata";

import { JsonInterface, JsonService } from './jsonService';
import { DbInterface, DbService } from './dbService';
import { PlayerInterface, PlayerService } from './playerService';
import { RxInterface, RxService } from './rxService';
import { EnvInterface, EnvService } from './envService';
import { types } from "util";

let TYPES = {
    DbInterface: Symbol("DbInterface"),
    JsonInterface: Symbol("JsonInterface"),   
    PlayerInterface: Symbol("PlayerInterface"),   
    RxInterface: Symbol("RxInterface"),
    EnvInterface: Symbol("EnvInterface")
}


let container = new Container();
container.bind<DbInterface>(TYPES.DbInterface).to(DbService);
container.bind<JsonInterface>(TYPES.JsonInterface).to(JsonService);
container.bind<PlayerInterface>(TYPES.PlayerInterface).to(PlayerService);
container.bind<RxInterface>(TYPES.RxInterface).to(RxService);
container.bind<EnvInterface>(TYPES.EnvInterface).to(EnvService);

export { 
    TYPES,
    container
};