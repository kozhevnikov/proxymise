const debug = require('debug')('proxymise');

const proxymise = (target) => {
  switch (typeof target) {
    case 'function': {
      return new Proxy(target, handler);
    }
    case 'object': {
      const proxy = () => target;
      proxy.__proxy__ = true;
      return new Proxy(proxy, handler);
    }
    default: {
      return target;
    }
  }
};

const handler = {
  /**
   * Trap for getting a property value
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
   */
  get(target, property, receiver) {
    debug('get', property);

    if (target.__proxy__) target = target();

    if (property !== 'then' && typeof target.then === 'function') {
      return proxymise(target.then(value => Reflect.get(value, property, receiver)));
    }

    const value = Reflect.get(target, property, receiver);
    return proxymise(typeof value === 'function' ? value.bind(target) : value);
  },

  /**
   * Trap for a function call
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply
   */
  apply(target, thisArg, argumentsList) {
    debug('apply');

    if (target.__proxy__) target = target();

    if (typeof target.then === 'function') {
      return proxymise(target.then(value => Reflect.apply(value, thisArg, argumentsList)));
    }

    return proxymise(Reflect.apply(target, thisArg, argumentsList));
  }
};

module.exports = proxymise;
