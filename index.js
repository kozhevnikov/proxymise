const proxymise = (target) => {
  if (typeof target === 'object') {
    const proxy = () => target;
    proxy.__proxy__ = true;
    return new Proxy(proxy, handler);
  }
  return typeof target === 'function' ? new Proxy(target, handler) : target;
};

const handler = {
  construct(target, argumentsList) {
    if (target.__proxy__) target = target();
    return proxymise(Reflect.construct(target, argumentsList));
  },

  get(target, property, receiver) {
    if (target.__proxy__) target = target();
    if (property !== 'then' && property !== 'catch' && typeof target.then === 'function') {
      return proxymise(target.then(value => get(value, property, receiver)));
    }
    return proxymise(get(target, property, receiver));
  },

  apply(target, thisArg, argumentsList) {
    if (target.__proxy__) target = target();
    if (typeof target.then === 'function') {
      return proxymise(target.then(value => Reflect.apply(value, thisArg, argumentsList)));
    }
    return proxymise(Reflect.apply(target, thisArg, argumentsList));
  }
};

const get = (target, property, receiver) => {
  const value = typeof target === 'object' ? Reflect.get(target, property, receiver) : target[property];
  if (typeof value === 'function' && typeof value.bind === 'function') {
    return Object.assign(value.bind(target), value);
  }
  return value;
};

module.exports = proxymise;
