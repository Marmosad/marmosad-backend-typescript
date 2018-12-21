import {inject, injectable} from "inversify";
import {Pack} from "../Interface/firestoreInterface";
import {FirestoreService} from "../services/firestoreService";
import {random, swap} from "../utils";

@injectable()
export class Deck {
    // Packs <pack name: string, pack: Pack>
    private _packs: Map<string, Pack> = new Map<string, Pack>();
    @inject(FirestoreService) private firestoreService: FirestoreService;

    public async initialize(packNames: string[]): Promise<boolean> {
        for (const name of packNames) {
            const pack: Pack = await this.firestoreService.getPack(name) as Pack;
            this.packs.set(name, pack);
            //generate black card stack and shuffle
            this.packs.get(name).blackCardStack = this.shuffleStack(this.generateCardStack(pack.blackCardCount));
            //generate white card stack and shuffle
            this.packs.get(name).whiteCardStack = this.shuffleStack(this.generateCardStack(pack.whiteCardCount));
        }
        return true
    }

    get packs() {
        return this._packs;
    }

    public generateCardStack(n: number): number[] {
        const stack = new Array(n);
        for (let i = 1; i <= n; i++) {
            stack[i - 1] = i;
        }
        return stack;
    }

    public shuffleStack(stack: number[]): number[] {
        const shuffled = stack.slice(0, stack.length); // deep copy
        for (let i = shuffled.length - 1; i >= 0; i--) {
            swap(shuffled, random(0, i), i)
        }
        return shuffled;
    }

    public async drawWhiteCard() {
        const cardPacks = this.packs.keys();
        const cardPack = this.pickRandomPack(cardPacks);
        const cardId = this.packs.get(cardPack).whiteCardStack.pop();
        this.packs.get(cardPack).whiteCardCount -= 1;
        return await this.firestoreService.getWhiteCard(cardPack, cardId)
    }

    public async drawBlackCard() {
        const cardPacks = this.packs.keys();
        const cardPack = this.pickRandomPack(cardPacks);
        const cardId = this.packs.get(cardPack).blackCardStack.pop();
        this.packs.get(cardPack).blackCardCount -= 1;
        return await this.firestoreService.getBlackCard(cardPack, cardId)
    }

    public pickRandomPack = (cardPacks: IterableIterator<string>)=>{
        let randPack = random(1, this.packs.size) - 1;
        let counter = 0;
        while (counter < randPack) {
            cardPacks.next();
            counter += 1
        }
        return cardPacks.next().value;
    }
}