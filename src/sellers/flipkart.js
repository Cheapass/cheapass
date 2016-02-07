import Scrape from './Scrape';

class Flipkart extends Scrape {
  parser(dom) {
    try {
      return {
        title: dom('[itemprop="name"]').text().replace(/^\s+|\s+$/g, ''),
        price: Number(dom('.pricing .selling-price').html().replace('Rs. ', '').replace(/,/g, '')),
        image: dom('.productImages .productImage').data('src'),
      };
    } catch (error) {
      return { error };
    }
  }
}

export const flipkart = new Flipkart();
