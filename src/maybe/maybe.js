"use strict";

const MType = Symbol("Maybe");
const isMaybe = x => (x instanceof Object && x.type === MType);
const isNone = x => x === null || x === undefined;

const Just = (x, last) => ({
  value : () => x,
  or : alternative => Maybe(isNone(x) ? alternative : x, x),
  then : f => Maybe(
    isNone(x) ? x : f(x),
    isNone(x) ? last : x
  ),
  catch : f => Maybe(isNone(x) ? f(last) : x, x),
  type : MType
});

const Maybe = (x, last = null) => isMaybe(x) ? x : Just(x, last);

module.exports = Maybe;
