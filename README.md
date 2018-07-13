# Proxymise

*Chainable Promise Proxy*

Lightweight no-dependencies ES6 [promise] [proxy] allowing you to drop non-stop `then()` or `await`
and chain.

[proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

## Use

```shell
npm i proxymise
```

```javascript
const proxymise = require('proxymise');

// Instead of thens
foo.then(value => value.bar())
  .then(value => value.baz())
  .then(value => value.qux)
  .then(value => console.log(value));

// Instead of awaits
const value1 = await foo;
const value2 = await value1.bar();
const value3 = await value2.baz();
const value4 = await value3.qux;
console.log(value4);

// Use proxymise
const value = await proxymise(foo).bar().baz().qux;
console.log(value);
```

## Examples

- [fetch with JSON](https://github.com/kozhevnikov/proxymise/blob/master/test/fetch.test.js)
- [Selenium WebDriverJS with Page Objects](https://github.com/kozhevnikov/proxymise/blob/master/test/selenium.test.js)
