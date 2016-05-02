import { getSellerFromUrl } from '../middlewares/index';
import {sellers as CONFIG} from '../config/config';
import * as sellers from '../sellers/index';
import logit from '../utils/logit';

export async function scraper({url, seller}) {
  const sellerVal = seller || getSellerFromUrl(url);
  // console.log(sellerVal);
  const sellerScraper = sellers[sellerVal];
  const scrapedInfo = await sellerScraper.scrape(url, CONFIG[sellerVal].props || {});
  return scrapedInfo;
}

export default async function scrapeClientRequest(req, res) {
  const { body: { url, seller } } = req;
  const scrapedInfo = await scraper({url, seller});

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
};
