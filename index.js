const debug = require('debug')('proxymise');

const proxy = (target) => {
  if (typeof target === 'object' || typeof target === 'function') {
    return new Proxy(target, handler);
  }
  return target;
};

const handler = {
  /**
   * Trap for getting a property value
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
   */
  get(target, property, receiver) {
    debug('get', property);

    if (property !== 'then' && typeof target.then === 'function') {
      return proxy(target.then(value => Reflect.get(value, property, receiver)));
    }

    const value = Reflect.get(target, property, receiver);
    return proxy(typeof value === 'function' ? value.bind(target) : value);
  },

  /**
   * Trap for a function call
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply
   */
  apply(target, thisArg, argumentsList) {
    debug('apply');
    return proxy(Reflect.apply(target, thisArg, argumentsList));
  }
};

module.exports = proxy;
