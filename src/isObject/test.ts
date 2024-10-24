/* eslint-env mocha */

import { isObject } from ".";

describe("isObject", (): void => {
  test.each([
    [{}, true],
    [{ a: 1 }, true],
    [[], false],
    [null, false],
    [undefined, false],
    [1, false],
    ["", false],
    [true, false],
    [new Map(), false],
    [new Set(), false],
    [() => {}, false],
  ])("isObject(%p) === %p", (input, expected): void =>
    expect(isObject(input)).toBe(expected),
  );
});
