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

/**
 * Works like getting a property from an object as a function
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get
 */
const get = (target, property, receiver) => {
  debug('Reflect.get', property);
  const value = typeof target === 'object' ? Reflect.get(target, property, receiver) : target[property];
  return typeof value === 'function' ? value.bind(target) : value;
};

/**
 * Calls a target function with arguments as specified
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply
 */
const apply = (target, thisArg, argumentsList) => {
  debug('Reflect.apply');
  return Reflect.apply(target, thisArg, argumentsList);
};

const handler = {
  /**
   * Trap for getting a property value
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
   */
  get(target, property, receiver) {
    debug('Proxy.get', property);

    if (target.__proxy__) target = target();

    if (property !== 'then' && typeof target.then === 'function') {
      return proxymise(target.then(value => get(value, property, receiver)));
    }

    return proxymise(get(target, property, receiver));
  },

  /**
   * Trap for a function call
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply
   */
  apply(target, thisArg, argumentsList) {
    debug('Proxy.apply');

    if (target.__proxy__) target = target();

    if (typeof target.then === 'function') {
      return proxymise(target.then(value => apply(value, thisArg, argumentsList)));
    }

    return proxymise(apply(target, thisArg, argumentsList));
  }
};

module.exports = proxymise;
