const Better = obj => new Proxy(obj, {
  get : (obj, key) => obj[key] instanceof Object
      ? Better(obj[key])
      : obj[key] === undefined
        ? undefined
        : obj[key]
});

const data = Better({ x : { y : { z : 100 } } });

console.log(data.x.y.x);
