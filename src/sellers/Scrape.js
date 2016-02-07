import fetch from '../utils/fetch';
import cheerio from 'cheerio';

export default class Scrape {
  constructor() {
    this.scrapedData = {};
  }

  getScrapedData() {
    return this.scrapedData;
  }

  getDom(response) {
    const { body } = response;
    return cheerio.load(body);
  }

  async scrape(url, options) {
    const response = await fetch(url, options);
    this.scrapedData = this.parser(this.getDom(response));
  }

  isValid() {
    const expectedKeys = ['price', 'title', 'image'];
    const matchingKeys = Object.keys(this.scrapedData).filter(scrapedKey => {
      return expectedKeys.includes(scrapedKey);
    });

    return matchingKeys.length === expectedKeys.length;
  }
}
