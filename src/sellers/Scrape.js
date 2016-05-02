import fetch from '../utils/fetch';
import cheerio from 'cheerio';

export default class Scrape {
  getDom(response) {
    const { body } = response;
    return cheerio.load(body);
  }

  parser() {
    throw new Error('<Scraper>#parser is not implemented!');
  }

  async scrape(url, options) {
    try {
      const response = await fetch(url, options);
      const scrapedData = this.parser(this.getDom(response));
      return {
        isValid: this.isValid(scrapedData),
        data: scrapedData,
      };
    } catch (error) {
      return {
        isValid: false,
        data: {},
      };
    }
  }

  isValid(scrapedData) {
    const expectedKeys = ['price', 'title', 'image'];
    const matchingKeys = Object.keys(scrapedData).filter(scrapedKey => {
      return expectedKeys.includes(scrapedKey);
    });

    return matchingKeys.length === expectedKeys.length;
  }
}
