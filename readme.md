# :link: Nest Safely
[![Build Status](https://travis-ci.org/kylehovey/nest-safely.svg?branch=master)](https://travis-ci.org/kylehovey/nest-safely)
[!License](https://img.shields.io/packagist/l/doctrine/orm.svg)

Despite allowing remarkable flexibility and ease of use, when accessing objects in JavaScript it doesn't take long before you run into this sort of error:

```JavaScript
const data = { deeply : { nested : { source : 42 } } };
const val = data.deeply.not.here;

// Uncaught TypeError: Cannot read property 'here' of undefined
//  at <anonymous>:2:29
```

Many libraries exist to solve the problem of accessing deeply nested values in an object, but they all seem to use evaluated strings of access keys like:

```JavaScript
const data = { deeply : { nested : { source : 42 } } };
const val = access(data, "deeply.not.here", "nothing");
console.log(val); // nothing
```

I found this too awkward to use in my code, so I decided to make an improvement using *functional programming*! I implemented a basic `Maybe` monad, then used the shiny new ES6 `Proxy` object to allow for deep object access (and more!) using minimally added syntax. Here's an example:

```JavaScript
const Safe = require("nest-safely");

const data = Safe({ deeply : { nested : { source : 42 } } });

const val = data.deeply.no.way.anything.is.here.or("nothing was found").value;

console.log(val); // "nothing was found"
```

Notice the use of an additional term `or` in the chain. You can think of each `.` in the sequence as a `.then` in a Promise chain inasmuch as any undefined access will fall through to the end. In this case, a default value is provided to the `or` method which will not have its functionality invoked if the value has not dropped out in the sequence:

```JavaScript
const Safe = require("nest-safely");

const data = Safe({ deeply : { nested : { source : 42 } } });

const val = data.deeply.nested.source.or("nothing was found").value;

console.log(val); // 42
```

The only other piece of machinery added is a `value` getter keyword that will unwrap the value out of the chain. Optionally, a `catch` method may also be used where you can supply a function that will be given the last value seen in the chain before `null` or `undefined` was encountered.

```JavaScript
const Safe = require("nest-safely");

const data = Safe({ deeply : { nested : { source : 42 } } });

const val = data.deeply.nested.does.not.have
  .catch(last => `Last seen: ${JSON.stringify(last)}`)
  .value;

console.log(val); // Last seen: { "source" : 42 }
```

And, just like a `Promise` chain, `or` or `catch` can be located anywhere in the chain:

```JavaScript
const Safe = require("nest-safely");

const data = Safe({ deeply : { nested : { source : 42 } } });

const val = data.deeply.nested.does.not.have
  .or({ x : { y : 34 } })
  .x
  .nope
  .catch(last => `Last seen: ${JSON.stringify(last)}`)
  .value;

console.log(val); // Last seen: { "y" : 42 }
```

I hope this small 30-line library is useful for you! If you have suggestions, make an issue and I'll be happy to look over it.
