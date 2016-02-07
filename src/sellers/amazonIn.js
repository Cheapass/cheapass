import Scrape from './Scrape';

class AmazonIn extends Scrape {
  parser(dom) {
    try {
      const data = {};
      const priceDoms = [
        '#priceblock_ourprice', '#priceblock_dealprice',
        '#priceblock_saleprice', '#buyingPriceValue',
        '#actualPriceValue', '#priceBlock',
        '#price', '#buyNewSection .offer-price',
      ];
      const titleDoms = ['#productTitle', '#btAsinTitle > span', '#btAsinTitle'];
      const imageDoms = ['#landingImage', '#prodImage', '#kib-ma-container-0 > img', '#imgBlkFront'];

      const priceDom = dom(priceDoms.find(pDom => dom(pDom).length));
      const titleDom = dom(titleDoms.find(tDom => dom(tDom).length));
      const imageDom = dom(imageDoms.find(iDom => dom(iDom).length));

      data.title = titleDom.text().replace(/<(?:.|\n)*?>/gm, '').replace(/^\s+|\s+$/g, '');
      data.image = imageDom.attr('src');

      if (priceDom.attr('id') === 'kindle_meta_binding_winner') {
        data.price = priceDom.html().match(/([0-9]+(\.[0-9]{2}))/)[0];
      } else {
        const priceDomParent = priceDom.find('.currencyINR').parent();
        priceDomParent.find('.currencyINR').remove();
        priceDomParent.find('.currencyINRFallback').remove();
        data.price = parseInt(priceDomParent.html().replace(/\s/g, '').replace(/,/gi, ''), 10);
      }

      return data;
    } catch (error) {
      return { error };
    }
  }
}

export const amazonIn = new AmazonIn();
