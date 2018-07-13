const proxymise = require('..');

describe('Proxy', () => {
  it('should support nested object proxies', () => {
    const proxy = proxymise({
      foo: proxymise({
        bar: proxymise({
          baz: 'qux'
        })
      })
    });
    expect(proxy.foo.bar.baz).toBe('qux');
  });

  it('should support nested function proxies', async () => {
    const proxy = proxymise({
      async foo() {
        return proxymise({
          async bar() {
            return proxymise({
              baz: 'qux'
            });
          }
        });
      }
    });
    expect(await proxy.foo().bar().baz).toBe('qux');
  });
});
