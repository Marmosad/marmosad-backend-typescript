import {FirestoreService} from "../../src/service/firestoreService";
import {} from "ts-jest"
import {container} from "../../src/inversify.config";


describe('End-to-end tests', () => {
    const fs: FirestoreService = container.resolve<FirestoreService>(FirestoreService)
    test('Should return white card', () => {
        return fs.getWhiteCard('room-309', 1).then(data => {
            expect(data.cardId).toEqual(1);
            expect(data.body).toBeDefined()
        });
    }, 20000);
    test('Should return black card', () => {
        return fs.getBlackCard('room-309', 1).then(data => {
            expect(data.cardId).toEqual(1);
            expect(data.body).toBeDefined()
        });
    }, 20000);
    test('Should return card pack', () => {
        return fs.getPack('room-309').then(data => {
            expect(data.whiteCardCount).toBeDefined();
            expect(data.blackCardCount).toBeDefined()
        });
    }, 20000);
});


describe('Unit tests on success', () => {
    const cardPackPromise = new Promise((resolve, reject) => {
            resolve(JSON.stringify({
                "message": "Successfully returned room-309",
                "responseObj": {
                    "whiteCardCount": 144,
                    "blackCardCount": 47
                }
            }))
        }
    );

    const cardPromise = new Promise((resolve, reject) => {
            resolve(JSON.stringify({
                "message": "Successfully returned black card fromroom-309",
                "responseObj": {
                    "cardId": 12,
                    "body": "My time management skills improved, but _______"
                }
            }))
        }
    );
    const fs: FirestoreService = container.resolve<FirestoreService>(FirestoreService)
    it('Should unpack black card', () => {
        return fs.unpackCard(cardPromise).then(data => {
            expect(data.cardId).toEqual(12);
            expect(data.body).toEqual("My time management skills improved, but _______")
        });
    });

    it('Should unpack card pack', () => {
        return fs.unpackCardPack(cardPackPromise).then(data => {
            expect(data.whiteCardCount).toEqual(144);
            expect(data.blackCardCount).toEqual(47)
        });
    });
});