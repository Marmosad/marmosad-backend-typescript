import {injectable} from "inversify";
import {Card, FirebaseEndpoints, Pack, Response} from "../interface/firestoreInterface";
import rp = require("request-promise-native");
import {FIREBASE_GET_BLACK_CARD, FIREBASE_GET_PACK, FIREBASE_GET_WHITE_CARD} from "../config/config";

export interface FirestoreInterface {
    getWhiteCard(pack: string, id: number): Promise<Card>;

    getBlackCard(pack: string, id: number): Promise<Card>;

    getPack(pack: string): Promise<Pack>
}

@injectable()
export class FirestoreService implements FirestoreInterface {
    private firebaseEndpoints: FirebaseEndpoints;

    constructor() {
        this.firebaseEndpoints = {
            getPack: FIREBASE_GET_PACK,
            getBlackCard: FIREBASE_GET_BLACK_CARD,
            getWhiteCard: FIREBASE_GET_WHITE_CARD,
        }
    }

    // Guards against an undefined/empty endpoint. When the configured URI is
    // missing the underlying request library throws deep in its own auth path
    // (e.g. "Username and password required") with no app stack frames, which is
    // impossible to trace. Fail fast with a clear, contextual message instead.
    private requireEndpoint(uri: string, name: string): string {
        if (!uri) {
            throw new Error('Firebase endpoint ' + name + ' is not configured ' +
                '(check the corresponding environment variable).');
        }
        return uri;
    }

    public getBlackCard(pack: string, id: number): Promise<Card> {
        const options = {
            method: 'GET',
            uri: this.requireEndpoint(this.firebaseEndpoints.getBlackCard, 'getBlackCard'),
            headers: {
                "card-pack-name": pack,
                "card-id": id
            }
        };

        return this.unpackCard(rp(options).promise() as Promise<string>, 'getBlackCard')
    }

    public getWhiteCard(pack: string, id: number): Promise<Card> {
        const options = {
            method: 'GET',
            uri: this.requireEndpoint(this.firebaseEndpoints.getWhiteCard, 'getWhiteCard'),
            headers: {
                "card-pack-name": pack,
                "card-id": id
            }
        };

        return this.unpackCard(rp(options).promise() as Promise<string>, 'getWhiteCard')
    }

    public getPack(pack: string): Promise<Pack> {
        const options = {
            method: 'GET',
            uri: this.requireEndpoint(this.firebaseEndpoints.getPack, 'getPack'),
            headers: {
                "card-pack-name": pack,
            }
        };

        return this.unpackCardPack(rp(options).promise() as Promise<string>, 'getPack')
    }

    public unpackCardPack(response: Promise<string>, context = 'getPack') {
        return response.then(function (body) {
            const parsed = JSON.parse(body) as Response;
            return parsed.responseObj as Pack;
        }).catch(function (err: Error) {
                // Preserve the original stack while adding context about which
                // outbound call failed, rather than rethrowing a bare error.
                err.message = 'Firebase ' + context + ' request failed: ' + err.message;
                console.error(err);
                throw err;
            });
    }

    public unpackCard(response: Promise<string>, context = 'getCard') {
        return response.then(function (body) {
            const parsed = JSON.parse(body) as Response;
            return parsed.responseObj as Card;
        }).catch(function (err: Error) {
                // Preserve the original stack while adding context about which
                // outbound call failed, rather than rethrowing a bare error.
                err.message = 'Firebase ' + context + ' request failed: ' + err.message;
                console.error(err);
                throw err;
            });
    }
}
