import "reflect-metadata"
import {Container} from "inversify";
import {FirestoreService} from "./services/firestoreService";
import BoardManagementService from "./services/boardServices";
import {Http} from "./services/httpSingletonService";
import Board from "./board";
import {SocketService} from "./services/socketServices";


const container = new Container();
container.bind<FirestoreService>(FirestoreService).toSelf();
container.bind<Http>(Http).toSelf().inSingletonScope();
container.bind<Board>(Board).toSelf();
container.bind<SocketService>(SocketService).toSelf();


export {container};