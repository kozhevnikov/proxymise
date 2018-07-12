const proxymise = require('..');
const fetch = proxymise(require('node-fetch'));

describe('fetch', () => {
  it('should fetch json', async () => {
    const value = await fetch('https://api.jsonbin.io/b/5b47e175efaed72daef1ca4d').json().foo.bar;
    expect(value).toBe('baz');
  });
});
