const proxymise = require('..');

class Foo {
  constructor() {
    this.qux = 'qux';
  }

  async bar() {
    return {
      baz: async () => this.qux
    };
  }
}

describe('class', () => {
  it('should instantiate proxy', async () => {
    const Foo2 = proxymise(Foo);
    const value = await new Foo2().bar().baz();
    expect(value).toBe('qux');
  });
});
