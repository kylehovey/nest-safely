// Mocking the test library, I know, I know
const [ it, describe ] = Array(2).fill(() => {});
const Better = require("./access.js");

describe(Better, () => {
  const nested = { a : { b : { c : { d : 42 } } } };

  it("still allows intermediary access like a normal object", () => {
    const obj = Better(nested);

    expect(obj.a.b.c.d.value()).toEqual(42);
  });

  it("will not error when accessing undefined space", () => {
    const obj = Better(nested);

    expect(obj.a.fish.hoopla.dni.value()).toEqual(undefined);
  });

  it("allows for a default value in lieu of desired value", () => {
    const obj = Better(nested);

    expect(obj.a.fish.hoopla.dni.or(9001).value()).toEqual(9001);
  });

  it("lets you find what the last value was", () => {
    const obj = Better(nested);

    expect(
      obj.a.b.fish.atrus.catch(x => JSON.stringify(x))
    ).toEqual("{\"c\":{\"d\":42}}")
  });
});
