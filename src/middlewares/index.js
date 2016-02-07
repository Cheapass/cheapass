import validUrl from 'valid-url';
import urlParse from 'url-parse';

const FLIPKART = 'flipkart';
const AMAZON_IN = 'amazonIn';
const SNAPDEAL = 'snapdeal';
const HEALTHKART = 'healthkart';
const ZIVAME = 'zivame';
const JABONG = 'jabong';
const FABFURNISH = 'fanfurnish';
const INFIBEAM = 'infibeam';

export const sellers = {
  [FLIPKART]: {
    label: 'Flipkart',
    hostname: 'flipkart.com',
    affiliateParams: { affid: 'aakashlpin' },
    deeplink: true,
    scrape: {
      userAgent: true,
    },
  },
  [AMAZON_IN]: {
    label: 'Amazon India',
    hostname: 'amazon.in',
    affiliateParams: { tag: 'cheapass0a-21' },
    deeplink: true,
    scrape: {
      userAgent: false,
    },
  },
  [SNAPDEAL]: {
    label: 'Snapdeal',
    hostname: 'snapdeal.com',
    affiliateParams: { aff_id: '12129', utm_source: 'aff_prog', utm_campaign: 'afts', offer_id: '17'},
    deeplink: true,
    scrape: {
      userAgent: true,
    },
  },
  [HEALTHKART]: {
    label: 'HealthKart',
    hostname: 'healthkart.com',
  },
  [ZIVAME]: {
    label: 'Zivame',
    hostname: 'zivame.com',
  },
  [JABONG]: {
    label: 'Jabong',
    hostname: 'jabong.com',
    scrape: {
      userAgent: true,
    },
  },
  [FABFURNISH]: {
    label: 'FabFurnish',
    hostname: 'fabfurnish.com',
  },
  [INFIBEAM]: {
    label: 'Infibeam',
    hostname: 'infibeam.com',
  },
};

const hostnames = Object.keys(sellers).map(seller => sellers[seller].hostname);
const hostnameToSellerIdMap = Object.keys(sellers).reduce((map, seller) => {
  map[sellers[seller].hostname] = seller;
  return map;
}, {});

const getHostnameFromUrl = (url) => {
  const { hostname } = urlParse(url, true);
  return hostname;
};

const respondInvalidRequest = ({res, status}) => {
  res.status(400).json({status});
};

export const isUrl = (req, res, next) => {
  const { url } = req.body;

  if (validUrl.isWebUri(url)) {
    return next();
  }

  return respondInvalidRequest({res, status: 'Invalid URL'});
};

export const isScrapable = (req, res, next) => {
  const { url } = req.body;
  const urlHostname = getHostnameFromUrl(url);
  const sellerHostname = hostnames.find(hostname => {
    return urlHostname.indexOf(hostname) !== -1;
  });

  if (sellerHostname) {
    req.sellerId = hostnameToSellerIdMap[sellerHostname];
    return next();
  }

  return respondInvalidRequest({res, status: 'URL not supported.'});
};
