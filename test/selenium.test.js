const { Builder } = require('selenium-webdriver');
require('chromedriver');

const proxymise = require('..');

describe('Selenium', () => {
  let driver;

  beforeEach(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
  });

  it('should chain page objects', async () => {
    const results = await proxymise(GoogleHomePage)
      .open(driver)
      .query('test')
      .search()
      .results();

    expect(results).toMatch('seconds');
  }, 10000);

  afterEach(async () => {
    await driver.quit();
  });
});

class GoogleHomePage {
  constructor(driver) {
    this.driver = driver;
  }

  static async open(driver) {
    await driver.get('https://www.google.co.uk/');
    return new GoogleHomePage(driver);
  }

  async query(value) {
    const input = this.driver.findElement({ css: 'input[name="q"]' });
    await input.clear();
    await input.sendKeys(value);
    return this;
  }

  async search() {
    await this.driver.findElement({ css: 'input[name="btnK"]' }).click();
    return new GoogleResultsPage(this.driver);
  }
}

class GoogleResultsPage {
  constructor(driver) {
    this.driver = driver;
  }

  async results() {
    const stats = await this.driver.findElement({ id: 'resultStats' }).getText();
    return stats.trim();
  }
}
