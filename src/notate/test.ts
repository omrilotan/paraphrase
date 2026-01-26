import { describe, it } from "node:test";
import assert from "node:assert";
import { notate } from "./index.ts";

const dummy = {
  top: {
    middle: {
      low: "value",
    },
  },
  nowhere: null,
  list: [
    "A",
    "B",
    {
      key: "balue",
    },
  ],
};

describe("notate", (): void => {
  it("Should throw an error when non string is supposed to be processed", (): void =>
    assert.throws(() => notate({}, null as any), TypeError));

  it("Resolves to nested data structure", (): void =>
    assert.deepStrictEqual(notate(dummy, "top.middle"), { low: "value" }));

  it("Resolves to an object", (): void =>
    assert.strictEqual(notate(dummy, "top.middle.low"), "value"));

  it("Resolves missing data to 'undefined'", (): void =>
    assert.strictEqual(notate(dummy, "missing.data"), undefined));

  it("resolves null data", (): void =>
    assert.strictEqual(notate(dummy, "nowhere.else"), null));

  it("Resolves parts of an array", (): void =>
    assert.strictEqual(notate(dummy, "list.0"), "A"));

  it("Resolves objects in an array", (): void =>
    assert.strictEqual(notate(dummy, "list.2.key"), "balue"));
});
