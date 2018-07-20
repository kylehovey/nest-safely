const Maybe = require("../maybe/maybe.js");
const symbols = [ "value", "or", "handle" ]
  .map(token => [ Symbol(token), token ]);
const [ [ value ], [ or ], [ handle ] ] = symbols;
const forward = new Map([
  [ value, m => m.value ],
  [ or, (m, args) => m.or(...args) ],
  [ handle, (m, args) => m.catch(...args) ]
]);

const Safe = obj => new Proxy(Maybe(obj), {
  get : (m, key) => key === value
    ? m.value()
    : forward.has(key)
      ? (...args) => Safe(forward.get(key)(m, args))
      : Safe(m.then(({ [key] : val }) => val))
});

symbols.forEach(([ symbol, token ]) => {
  Object.defineProperty(Safe, token, { value : symbol });
});

module.exports = Safe;
