"use strict";

const Better = require("../src/access/access.js");

describe("Better", () => {
  const nested = { a : { b : { c : { d : 42 } } } };

  it("still allows intermediary access like a normal object", () => {
    const obj = Better(nested);

    expect(obj.a.b.c.d.value).toBe(42);
  });

  it("will not error when accessing undefined space", () => {
    const obj = Better(nested);

    expect(obj.a.fish.hoopla.dni.value).toBe(undefined);
  });

  it("allows for a default value in lieu of desired value", () => {
    const obj = Better(nested);

    expect(obj.a.fish.hoopla.dni.or(9001).value).toBe(9001);
  });

  it("will not use the default value if not nothing", () => {
    const obj = Better(nested);

    expect(obj.a.b.c.d.or(9001).value).toBe(42);
  });

  it("lets you find what the last value was", () => {
    const obj = Better(nested);

    expect(
      obj.a.b.fish.atrus.catch(x => JSON.stringify(x)).value
    ).toBe("{\"c\":{\"d\":42}}");
  });

  it("allows for 'or' or 'catch' anywhere in the chain", () => {
    const obj = Better(nested);

    expect(
      obj.a.b.does.not.have
        .or({ x : { y : 34 } })
        .x
        .nope
        .catch(last => `Last seen: ${JSON.stringify(last)}`)
        .value
    ).toBe("Last seen: {\"y\":34}");
  });
});
