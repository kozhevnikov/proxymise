const proxymise = require('..');

describe('handler.get', () => {
  it('should get value', () => {
    const proxy = proxymise('foo');
    expect(proxy).toBe('foo');
  });

  it('should get object', () => {
    const proxy = proxymise({ foo: 'bar' });
    expect(proxy.foo).toBe('bar');
  });

  it('should get nested object', () => {
    const proxy = proxymise({ foo: { bar: 'baz' } });
    expect(proxy.foo.bar).toBe('baz');
  });
});
