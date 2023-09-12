/* eslint-env mocha */

import { notate } from ".";

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
    expect(() => notate({}, null as any)).toThrow(TypeError));

  it("Resolves to nested data structure", (): void =>
    expect(notate(dummy, "top.middle")).toEqual({ low: "value" }));

  it("Resolves to an object", (): void =>
    expect(notate(dummy, "top.middle.low")).toBe("value"));

  it("Resolves missing data to 'undefined'", (): void =>
    expect(notate(dummy, "missing.data")).toBeUndefined());

  it("resolves null data", (): void =>
    expect(notate(dummy, "nowhere.else")).toBeNull());

  it("Resolves parts of an array", (): void =>
    expect(notate(dummy, "list.0")).toBe("A"));

  it("Resolves objects in an array", (): void =>
    expect(notate(dummy, "list.2.key")).toBe("balue"));
});
