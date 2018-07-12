const proxymise = require('..');

describe('Promise', () => {
  it('should get value', async () => {
    const promise = proxymise(Promise.resolve('foo'));
    expect(await promise).toBe('foo');
  });

  it('should get object', async () => {
    const promise = proxymise(Promise.resolve({ foo: 'bar' }));
    expect(await promise.foo).toBe('bar');
  });

  it('should get nested object', async () => {
    const promise = proxymise(Promise.resolve({
      foo: Promise.resolve({
        bar: Promise.resolve({
          baz: 'qux'
        })
      })
    }));
    expect(await promise.foo.bar.baz).toBe('qux');
  });

  it('should apply function', async () => {
    const promise = proxymise(async () => 'foo');
    expect(await promise()).toBe('foo');
  });
});
