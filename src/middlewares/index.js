import validUrl from 'valid-url';
import urlParse from 'url-parse';
import {sellers} from '../config/config';

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
