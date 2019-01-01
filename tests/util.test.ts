import * as jest from "ts-jest";
import {stringNotEmpty} from "../src/util";

console.log('Testing on jest ' + jest.version);

it('should detect all forms of empty strings', function () {
    expect(stringNotEmpty('')).toEqual(false);
    expect(stringNotEmpty(' ')).toEqual(false);
    let a: string;
    expect(stringNotEmpty(a)).toEqual(false);
    a = null;
    expect(stringNotEmpty(a)).toEqual(false);
    expect(stringNotEmpty('1')).toEqual(true);
    expect(stringNotEmpty('  1         ')).toEqual(true);
});
