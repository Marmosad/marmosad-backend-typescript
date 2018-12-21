import {container} from "../../src/inversify.config";
import {Deck} from "../../src/object/deck";
import {} from "ts-jest"

describe('Deck test', () => {
    const deck = container.resolve(Deck);
    it('should init card pack', async () => {
        await deck.initialize(['room-309']);'' +
        expect(deck.packs.get('room-309')).toBeTruthy();
    });
});