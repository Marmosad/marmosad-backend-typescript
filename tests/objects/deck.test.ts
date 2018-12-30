import {container} from "../../src/config/inversify.config";
import {Deck} from "../../src/object/deck";
import * as jest from "ts-jest"
import {Card} from "../../src/interface/firestoreInterface";
import {random} from "../../src/util";

console.log('Testing on jest ' + jest.version);

const ifUnique = (arr: Card[], card: Card) => {
    let ret = 0;
    for (const i of arr) {
        if (i.cardId === card.cardId) {
            ret++;
        }
    }
    return ret === 1;
};

const ifContains = (cards: Card[], cardId: number) => {
    for (const i of cards) {
        if (i.cardId === cardId) {
            return true
        }
    }
    return false;
};

describe('Deck init test', () => {
    const deck = container.resolve(Deck);
    it('should init card pack', async () => {
        await deck.initialize(['room-309']);
        expect(deck.packs.get('room-309')).toBeTruthy();
        expect(deck.packs.get('room-309').blackCardCount).toEqual(deck.packs.get('room-309').blackCardStack.length);
        expect(deck.packs.get('room-309').whiteCardCount).toEqual(deck.packs.get('room-309').whiteCardStack.length);
    }, 20000);
    it('should generate random', () => {
        const upper = Math.floor(Math.random() * 100);
        const lower = Math.floor(Math.random() * 10);
        for (let i = 0; i < 1000; i++) {
            const ranNum = random(lower, upper);
            expect(ranNum).toBeGreaterThanOrEqual(lower);
            expect(ranNum).toBeLessThanOrEqual(upper);
            expect(Number.isInteger(ranNum)).toBeTruthy();
        }
    });
    it('should generate card stack', function () {
        const size = Math.floor(Math.random() * 1000);
        const stack = deck.generateCardStack(size);
        for (const card of stack) {
            expect(Number.isInteger(card.cardId)).toBeTruthy();
            expect(card.cardId).toBeGreaterThanOrEqual(1);
            expect(card.cardId).toBeLessThanOrEqual(size);
            expect(ifUnique(stack, card)).toBeTruthy();
        }
    });
    it('should generate shuffled card stack', function () {
        const size = Math.floor(Math.random() * 1000);
        const stack = Deck.shuffle(deck.generateCardStack(size));
        for (const card of stack) {
            expect(Number.isInteger(card.cardId)).toBeTruthy();
            expect(card.cardId).toBeGreaterThanOrEqual(1);
            expect(card.cardId).toBeLessThanOrEqual(size);
            expect(ifUnique(stack, card)).toBeTruthy();
        }
    });
});

describe('Deck draw test with API', () => {
    const deck = container.resolve(Deck);
    it('should return valid white card and decrement deck', async () => {
        // this test currently only accounts for the one cardpack we have
        // TODO: change ^^ when we have more than one cardpack
        await deck.initialize(['room-309']);
        let size = deck.packs.get('room-309').whiteCardStack.length;
        const card = await deck.drawWhiteCard() as Card;
        expect(card).toBeTruthy();
        expect(deck.packs.get('room-309').whiteCardStack.length).toEqual(size - 1);
        expect(deck.packs.get('room-309').whiteCardCount).toEqual(size - 1);
        expect(ifContains(deck.packs.get('room-309').whiteCardStack, card.cardId)).toEqual(false);
        console.log("[TEST EVENT] card returned by deck", card);
    }, 10000);
    it('should return valid black card and decrement deck', async () => {
        // this test currently only accounts for the one card pack we have
        // TODO: change ^^ when we have more than one card pack
        await deck.initialize(['room-309']);
        let size = deck.packs.get('room-309').blackCardStack.length;
        const card = await deck.drawBlackCard() as Card;
        expect(card).toBeTruthy();
        expect(deck.packs.get('room-309').blackCardStack.length).toEqual(size - 1);
        expect(deck.packs.get('room-309').blackCardCount).toEqual(size - 1);
        expect(ifContains(deck.packs.get('room-309').blackCardStack, card.cardId)).toEqual(false);
        console.log("[TEST EVENT] card returned by deck", card);
    }, 10000);
});

describe('Eventuality sync test', () => {
    it('should not be cached', async () => {
        const deck = container.resolve(Deck);
        await deck.initialize(['room-309']);
        expect(deck.packs.get('room-309').blackCardStack[0].body).toBeFalsy();
        expect(deck.packs.get('room-309').whiteCardStack[0].body).toBeFalsy();
    });
    it('should be synced over time', (done) => {
        const deck = container.resolve(Deck);
        deck.initialize(['room-309']).then(async () => {
            expect(deck.packs.get('room-309').blackCardStack[0].body).toBeFalsy();
            expect(deck.packs.get('room-309').whiteCardStack[0].body).toBeFalsy();
            deck.cacheCards();
            expect(await deck.drawWhiteCard()).toBeTruthy();
            expect(await deck.drawBlackCard()).toBeTruthy();
            expect(await deck.drawWhiteCard()).toBeTruthy();
            expect(await deck.drawBlackCard()).toBeTruthy();
            setTimeout(() => {
                const cs = deck.packs.get('room-309');
                expect(cs.blackCardStack[random(0, cs.blackCardStack.length - 1)].body).toBeTruthy();
                expect(cs.blackCardStack[random(0, cs.blackCardStack.length - 1)].body).toBeTruthy();
                expect(cs.blackCardStack[random(0, cs.blackCardStack.length - 1)].body).toBeTruthy();
                expect(cs.whiteCardStack[random(0, cs.blackCardStack.length - 1)].body).toBeTruthy();
                expect(cs.whiteCardStack[random(0, cs.blackCardStack.length - 1)].body).toBeTruthy();
                expect(cs.whiteCardStack[random(0, cs.blackCardStack.length - 1)].body).toBeTruthy();
                done()
            }, 15000);
        });

    }, 25000);
});
