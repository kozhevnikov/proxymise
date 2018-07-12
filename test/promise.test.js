const proxymise = require('..');

describe('Promise', () => {
  it('should get value', async () => {
    const promise = proxymise(Promise.resolve('foo'));
    expect(await promise).toBe('foo');
  });

  it('should get value property', async () => {
    const promise = proxymise({
      async foo() {
        return 'bar';
      }
    });
    expect(await promise.foo().length.toString()).toBe('3');
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

  it('should apply nested function', async () => {
    const promise = proxymise(async () => ({
      async foo() {
        return {
          async bar() {
            return 'baz';
          }
        };
      }
    }));
    expect(await promise().foo().bar()).toBe('baz');
  });

  it('should get/apply object/function', async () => {
    const promise = proxymise({
      async foo() {
        return {
          bar: {
            async baz() {
              return 'qux';
            }
          }
        };
      }
    });
    expect(await promise.foo().bar.baz()).toBe('qux');
  });
});
