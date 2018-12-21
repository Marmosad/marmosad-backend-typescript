import "reflect-metadata"
import {Container} from "inversify";
import {FirestoreService} from "./service/firestoreService";
import {Http, HttpInterface} from "./service/httpSingletonService";
import Board from "./object/board";
import {SocketService} from "./service/socketService";
import {Deck, DeckInterface} from "./object/deck";


const container = new Container();
container.bind<FirestoreService>(FirestoreService).toSelf();
container.bind<HttpInterface>(Http).toSelf().inSingletonScope();
container.bind<Board>(Board).toSelf();
container.bind<SocketService>(SocketService).toSelf();
container.bind<DeckInterface>(Deck).toSelf();
export {container};