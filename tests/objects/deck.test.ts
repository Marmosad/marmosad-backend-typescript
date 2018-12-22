import {container} from "../../src/inversify.config";
import {Deck} from "../../src/object/deck";
import {} from "ts-jest"
import {Card} from "../../src/Interface/firestoreInterface";
import {random} from "../../src/util";

const ifUnique = (arr, num) => {
    let ret = 0;
    for (const i of arr) {
        if (i === num) {
            ret++;
        }
    }
    return ret === 1;
};

const ifContains = (cards: number[], card) => {
    for (const i of cards) {
        if (i === card) {
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
    }, 10000);
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
            expect(Number.isInteger(card)).toBeTruthy();
            expect(card).toBeGreaterThanOrEqual(1);
            expect(card).toBeLessThanOrEqual(size);
            expect(ifUnique(stack, card)).toBeTruthy();
        }
    });
    it('should generate shuffled card stack', function () {
        const size = Math.floor(Math.random() * 1000);
        const stack = Deck.shuffle(deck.generateCardStack(size));
        for (const card of stack) {
            expect(Number.isInteger(card)).toBeTruthy();
            expect(card).toBeGreaterThanOrEqual(1);
            expect(card).toBeLessThanOrEqual(size);
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
        expect(ifContains(deck.packs.get('room-309').whiteCardStack, card)).toEqual(false);
        console.log("[TEST EVENT] card returned by deck" , card);
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
        expect(ifContains(deck.packs.get('room-309').blackCardStack, card)).toEqual(false);
        console.log("[TEST EVENT] card returned by deck" , card);
    }, 10000);
});