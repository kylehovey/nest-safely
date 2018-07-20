const Safe = require("../src/access/access.js");

describe("Safe", () => {
  const nested = { a : { b : { c : { d : 42 } } } };

  it("still allows intermediary access like a normal object", () => {
    const obj = Safe(nested);

    expect(obj.a.b.c.d[Safe.value]).toBe(42);
  });

  it("will not error when accessing undefined space", () => {
    const obj = Safe(nested);

    expect(obj.a.fish.hoopla.dni[Safe.value]).toBe(undefined);
  });

  it("allows for a default value in lieu of desired value", () => {
    const obj = Safe(nested);

    expect(obj.a.fish.hoopla.dni[Safe.or](9001)[Safe.value]).toBe(9001);
  });

  it("will not use the default value if not nothing", () => {
    const obj = Safe(nested);

    expect(obj.a.b.c.d[Safe.or](9001)[Safe.value]).toBe(42);
  });

  it("lets you find what the last value was", () => {
    const obj = Safe(nested);

    expect(
      obj.a.b.fish.atrus[Safe.handle](x => JSON.stringify(x))[Safe.value]
    ).toBe("{\"c\":{\"d\":42}}");
  });

  it("allows for 'Safe.or' or 'Safe.handle' anywhere in the chain", () => {
    const obj = Safe(nested);

    expect(
      obj.a.b.does.not.have
        [Safe.or]({ x : { y : 34 } })
        .x
        .nope
        [Safe.handle](last => `Last seen: ${JSON.stringify(last)}`)
        [Safe.value]
    ).toBe("Last seen: {\"y\":34}");
  });
});
