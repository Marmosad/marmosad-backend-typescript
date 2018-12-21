import "reflect-metadata"
import {Container} from "inversify";
import {FirestoreService} from "./services/firestoreService";
import BoardManagementService from "./services/boardService";
import {Http} from "./services/httpSingletonService";
import Board from "./object/board";
import {SocketService} from "./services/socketService";


const container = new Container();
container.bind<FirestoreService>(FirestoreService).toSelf();
container.bind<Http>(Http).toSelf().inSingletonScope();
container.bind<Board>(Board).toSelf();
container.bind<SocketService>(SocketService).toSelf();


export {container};