import { isUrl, isScrapable, sellers as config } from '../middlewares/index';
import * as sellers from '../sellers/index';

const routes = (server) => {
  // handler to process incoming scrape requests
  server.post('/scrape', isUrl, isScrapable, async (req, res) => {
    const { body: { url }, sellerId } = req;
    const sellerScraper = sellers[sellerId];

    await sellerScraper.scrape(url, config[sellerId].scrape || {});

    if (sellerScraper.isValid()) {
      return res.json(sellerScraper.getScrapedData());
    }

    res.status(500).json({status: 'Unable to process'});
  });
};

export default routes;
