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
  /** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get */
  get(target, property, receiver) {
    if (target.__proxy__) target = target();

    if (property !== 'then' && property !== 'catch' && typeof target.then === 'function') {
      return proxymise(target.then(value => get(value, property, receiver)));
    }

    return proxymise(get(target, property, receiver));
  },

  /** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/apply */
  apply(target, thisArg, argumentsList) {
    if (target.__proxy__) target = target();

    if (typeof target.then === 'function') {
      return proxymise(target.then(value => Reflect.apply(value, thisArg, argumentsList)));
    }

    return proxymise(Reflect.apply(target, thisArg, argumentsList));
  }
};

/** @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get */
const get = (target, property, receiver) => {
  const value = typeof target === 'object' ? Reflect.get(target, property, receiver) : target[property];
  return typeof value === 'function' ? value.bind(target) : value;
};

module.exports = proxymise;
