const Maybe = require("./maybe");
const forward = new Map([
  [ "value", m => m.value ],
  [ "or", (m, args) => m.or(...args) ],
  [ "then", (m, args) => m.then(...args) ],
  [ "catch", (m, args) => m.catch(...args) ]
]);

const Better = obj => new Proxy(Maybe(obj), {
  get : (m, key) => forward.has(key)
    ? (...args) => forward.get(key)(m, args)
    : Better(m.then(({ [key] : val }) => val))
});

module.exports = Better;
