import {interfaces, injectable, inject} from "inversify";
import {Card, FirebaseEndpoints, Pack, Response} from "../interface/firestoreInterface";
import * as rp from "request-promise-native"
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

    public getBlackCard(pack: string, id: number): Promise<Card> {
        const options = {
            method: 'GET',
            uri: this.firebaseEndpoints.getBlackCard,
            headers: {
                "card-pack-name": pack,
                "card-id": id
            }
        };

        return this.unpackCard(rp(options).promise())
    }

    public getWhiteCard(pack: string, id: number): Promise<Card> {
        const options = {
            method: 'GET',
            uri: this.firebaseEndpoints.getWhiteCard,
            headers: {
                "card-pack-name": pack,
                "card-id": id
            }
        };

        return this.unpackCard(rp(options).promise())
    }

    public getPack(pack: string): Promise<Pack> {
        const options = {
            method: 'GET',
            uri: this.firebaseEndpoints.getPack,
            headers: {
                "card-pack-name": pack,
            }
        };

        return this.unpackCardPack(rp(options).promise())
    }

    public unpackCardPack(response: Promise<any>) {
        return response.then(function (body) {
            const response = JSON.parse(body) as Response;
            return response.responseObj as Pack;
        }).catch(function (err) {
                console.log(err);
                throw err;
            });
    }

    public unpackCard(response: Promise<any>) {
        return response.then(function (body) {
            const response = JSON.parse(body) as Response;
            return response.responseObj as Card;
        }).catch(function (err) {
                console.log(err);
                throw err;
            });
    }
}
