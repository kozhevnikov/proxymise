const debug = require('debug')('proxymise');

const handler = {
  /**
   * Trap for getting a property value
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
   */
  get(target, property, receiver) {
    debug('get', property);
    return Reflect.get(target, property, receiver);
  }
};

module.exports = target => new Proxy(target, handler);
