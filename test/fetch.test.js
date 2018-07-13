const fetch = require('..')(require('node-fetch'));
const fetch2 = require('node-fetch');

describe('fetch', () => {
  const url = 'https://api.jsonbin.io/b/5b47e175efaed72daef1ca4d';

  it('should fetch with proxymise', async () => {
    const value = await fetch(url).json().foo.bar;
    expect(value).toBe('baz');
  });

  it('should fetch without proxymise', async () => {
    const response = await fetch2(url);
    const json = await response.json();
    const value = json.foo.bar;
    expect(value).toBe('baz');
  });
});
