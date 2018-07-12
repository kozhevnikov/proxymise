const proxymise = require('..');

describe('handler.apply', () => {
  it('should apply function', () => {
    const proxy = proxymise(() => 'foo');
    expect(proxy()).toBe('foo');
  });

  it('should apply nested function', () => {
    const proxy = proxymise(() => ({
      foo() {
        return {
          bar() {
            return 'qux';
          }
        };
      }
    }));
    expect(proxy().foo().bar()).toBe('qux');
  });
});
