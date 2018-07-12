const proxymise = require('..');

describe('Promise', () => {
  it('should get value', async () => {
    const promise = proxymise(Promise.resolve('foo'));
    expect(await promise).toBe('foo');
  });
});
