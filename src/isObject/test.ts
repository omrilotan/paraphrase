import { describe, test } from "node:test";
import assert from "node:assert";
import { isObject } from "./index.ts";

const testCases = [
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
];

describe("isObject", (): void => {
  for (const [input, expected] of testCases) {
    test(`isObject(${JSON.stringify(input)}) === ${expected}`, (): void =>
      assert.strictEqual(isObject(input), expected));
  }
});
