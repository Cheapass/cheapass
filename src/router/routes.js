import { isUrl, isScrapable, sellers as CONFIG } from '../middlewares/index';
import * as sellers from '../sellers/index';
import logit from '../utils/logit';

const routes = (server) => {
  // handler to process incoming scrape requests
  server.post('/scrape', isUrl, isScrapable, async (req, res) => {
    const { body: { url }, sellerId } = req;
    const sellerScraper = sellers[sellerId];

    const scrapedInfo = await sellerScraper.scrape(url, CONFIG[sellerId].props || {});

    if (!scrapedInfo.isValid) {
      /**
       * log this for future debugging
       * this could imply something in the seller's website changed
       */
      logit.as('unable to scrape legit seller', {
        requestBody: req.body,
        scrapedInfo,
      }, { notify: true });

      res.status(500).json({status: 'Unable to process'});
    }

    return res.json(scrapedInfo.data);
  });
};

export default routes;
