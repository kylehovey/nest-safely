const Maybe = require("../src/maybe/maybe.js");
describe("Maybe", () => {
  const nested = { a : { b : { c : { d : 42 } } } };

  it("chains like a promise", () => {
    expect(
      Maybe(nested)
        .then(({ a }) => a)
        .then(({ b }) => b)
        .then(({ c }) => c)
        .then(({ d }) => d)
        .value()
    ).toBe(42);
  });

  it("falls through to catch", () => {
    expect(
      Maybe(nested)
        .then(({ a }) => a)
        .then(({ b }) => b)
        .then(({ e }) => e)
        .then(({ fish }) => fish)
        .catch(last => `Last value: ${JSON.stringify(last)}`)
        .value()
    ).toBe("Last value: {\"c\":{\"d\":42}}");
  });

  it("allows default value response via `or`", () => {
    expect(
      Maybe(nested)
        .then(({ a }) => a)
        .then(({ b }) => b)
        .then(({ e }) => e)
        .then(({ fish }) => fish)
        .or(9000)
        .then(x => x + 1)
        .value()
    ).toBe(9001);
  });

  it("will act as a unit operator when recursed", () => {
    expect(
      Maybe(
        Maybe(
          nested
        )
      )
      .then(({ a }) => a)
      .then(({ b }) => b)
      .then(({ c }) => c)
      .then(({ d }) => d)
      .value()
    ).toBe(42);
  });
});
