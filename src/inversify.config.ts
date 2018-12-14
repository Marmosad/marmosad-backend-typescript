import "reflect-metadata"
import {Container} from "inversify";
import {TYPES} from "./models/types";
import {FirestoreService} from "./services/firestoreService";
import BoardService from "./services/boardServices";


const container = new Container();
container.bind<FirestoreService>(FirestoreService).toSelf();
container.bind<BoardService>(BoardService).toSelf()
export {container};