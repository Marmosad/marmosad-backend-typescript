import "reflect-metadata"
import {Container} from "inversify";
import {FirestoreService} from "../service/firestoreService";
import {Http, HttpInterface} from "../service/httpSingletonService";
import Board from "../object/board";
import {SocketService} from "../service/socketService";
import {Deck, DeckInterface} from "../object/deck";
import {RxEventsInterface} from "../interface/rxEventInterface";
import {BoardEventHandler} from "../handler/boardEventHandler";


const container = new Container();
container.bind<FirestoreService>(FirestoreService).toSelf().inTransientScope();
container.bind<HttpInterface>(Http).toSelf().inSingletonScope();
container.bind<Board>(Board).toSelf().inTransientScope();
container.bind<SocketService>(SocketService).toSelf().inTransientScope();
container.bind<Deck>(Deck).toSelf().inTransientScope();
container.bind<BoardEventHandler>(BoardEventHandler).toSelf().inTransientScope();

export {container};
