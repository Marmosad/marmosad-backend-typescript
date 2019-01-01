import {inject, injectable} from "inversify";
import {Card, Pack} from "../interface/firestoreInterface";
import {FirestoreService} from "../service/firestoreService";
import {random, stringNotEmpty, swap} from "../util";

export interface DeckInterface {
    initialize(packNames: string[]): Promise<boolean>;

    packs: Map<string, Pack>;

    generateCardStack(n: number): Card[];

    drawWhiteCard(): Promise<Card>;

    drawBlackCard(): Promise<Card>;
}

@injectable()
export class Deck implements DeckInterface {
    // Packs <pack boardName: string, pack: Pack>
    private _packs: Map<string, Pack> = new Map<string, Pack>();
    @inject(FirestoreService) private firestoreService: FirestoreService;

    public async initialize(packNames: string[] = ['room-309']): Promise<boolean> {
        for (const name of packNames) {
            const pack: Pack = await this.firestoreService.getPack(name) as Pack;
            this.packs.set(name, pack);
            //generate black card stack and shuffle
            this.packs.get(name).blackCardStack = Deck.shuffle(this.generateCardStack(pack.blackCardCount));
            //generate white card stack and shuffle
            this.packs.get(name).whiteCardStack = Deck.shuffle(this.generateCardStack(pack.whiteCardCount));
        }

        return true
    }

    get packs(): Map<string, Pack> {
        return this._packs;
    }

    public generateCardStack(n: number): Card[] {
        const stack = new Array(n);
        for (let i = 1; i <= n; i++) {
            stack[i - 1] = {cardId: i} as Card;
        }
        return stack;
    }

    public cacheCards() {
        this.packs.forEach((value, key, map) => {
            for (let i = this.packs.get(key).whiteCardStack.length - 1; i >= 0; i--) {
                this.firestoreService.getWhiteCard(key, this.packs.get(key).whiteCardStack[i].cardId).then(((card: Card) => {
                    // prevents race conditions
                    if (typeof this.packs.get(key).whiteCardStack[i] !== "undefined")
                        this.packs.get(key).whiteCardStack[i].body = card.body;
                }));

            }
            for (let i = this.packs.get(key).blackCardStack.length - 1; i >= 0; i--) {
                this.firestoreService.getBlackCard(key, this.packs.get(key).blackCardStack[i].cardId).then(((card: Card) => {
                    // prevents race conditions
                    if (typeof this.packs.get(key).blackCardStack[i] !== "undefined")
                        this.packs.get(key).blackCardStack[i].body = card.body;
                }));

            }
        })
    }

    public static shuffle(stack: Card[]): Card[] {
        const shuffled = stack.slice(0, stack.length);
        for (let i = shuffled.length - 1; i >= 0; i--) {
            swap(shuffled, random(0, i), i)
        }
        return shuffled;
    }

    public async drawWhiteCard(): Promise<Card> {
        console.log('[DBG] new card draw called ');
        const cardPacks = this.packs.keys();
        const cardPack = this.pickRandomPack(cardPacks);
        const card = this.packs.get(cardPack).whiteCardStack.pop();
        this.packs.get(cardPack).whiteCardCount -= 1;
        const returnCache = stringNotEmpty(card.body) && card.cardId >= 1;
        if (returnCache) {
            return card;
        }
        return await this.firestoreService.getWhiteCard(cardPack, card.cardId)
    }

    public async drawBlackCard(): Promise<Card> {
        const cardPacks = this.packs.keys();
        const cardPack = this.pickRandomPack(cardPacks);
        const card = this.packs.get(cardPack).blackCardStack.pop();
        this.packs.get(cardPack).blackCardCount -= 1;
        const returnCache = stringNotEmpty(card.body) && card.cardId >= 1;
        if (returnCache) {
            return card;
        }
        return await this.firestoreService.getBlackCard(cardPack, card.cardId)
    }

    private pickRandomPack = (cardPacks: IterableIterator<string>) => {
        let randPack = random(1, this.packs.size) - 1;
        let counter = 0;
        while (counter < randPack) {
            cardPacks.next();
            counter += 1
        }
        return cardPacks.next().value;
    }
}
