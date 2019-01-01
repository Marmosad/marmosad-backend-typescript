// this will modify original array as well
export function swap(array: any[], pos1: number, pos2: number): any[] {
    if (0 <= pos1 && pos1 < array.length && 0 <= pos2 && pos2 < array.length) {
        const temp = array[pos1];
        array[pos1] = array[pos2];
        array[pos2] = temp;
    }
    return array;
}

export function random(lower: number, upper: number): number {
    if (lower == upper) {
        return lower
    }

    lower = Math.floor(lower);
    upper = Math.floor(upper);
    let rand = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    while (upper < rand || rand < lower) {
        rand = Math.floor(Math.random() * (upper - lower + 1)) + lower;
    }
    return rand;
}

export function stringNotEmpty(s: string): boolean{
    return (s != null && typeof s != "undefined" && s != '' && s.trim() != '') as boolean;
}
