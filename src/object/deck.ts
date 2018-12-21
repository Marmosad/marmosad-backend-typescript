import {inject, injectable} from "inversify";
import {Pack} from "../Interface/firestoreInterface";
import {SocketService} from "../services/socketService";
import {FirestoreService} from "../services/firestoreService";
import {TransformError} from "request-promise-native/errors";

@injectable()
export class Deck {
    // Packs <pack name: string, pack: Pack>
    private _packs: Map<string, Pack> = new Map<string, Pack>();
    @inject(FirestoreService) private firestoreService: FirestoreService;

    public async initialize(packNames: string[]):Promise<boolean> {
        for (const name of packNames) {
            const pack: Pack = await this.firestoreService.getPack(name) as Pack;
            this.packs.set(name, pack);
        }
        return true
    }
    get packs(){
        return this._packs;
    }
}