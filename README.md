# Proxymise

[![npm](https://img.shields.io/npm/v/proxymise.svg)](https://www.npmjs.com/package/proxymise)

Chainable Promise Proxy.

Lightweight ES6 [Proxy] for [Promises] with no additional dependencies. Proxymise allows for method
and property chaining without need for intermediate `then()` or `await` for cleaner and simpler code.

[Proxy]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[Promises]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

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

## Practical Examples

- [Fetch and parse JSON](https://github.com/kozhevnikov/proxymise/blob/master/test/fetch.test.js)
- [Amazon DynamoDB get item](https://github.com/kozhevnikov/proxymise/blob/master/test/dynamodb.test.js)
- [Selenium WebDriverJS and Page Objects](https://github.com/kozhevnikov/proxymise/blob/master/test/selenium.test.js)

## Performance

Proxymised [benchmark] with 10000 iterations is practically as performant as the non-proxymised one.

[benchmark]: https://github.com/kozhevnikov/proxymise/blob/master/test/benchmark.js

```shell
node test/benchmark.js 
with proxymise: 3907.582ms
without proxymise: 3762.375ms
```
