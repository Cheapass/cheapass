const mongoose = require('mongoose');
const config = require('../../config/config');
const _ = require('underscore');
const urlLib = require('url');

function getSellerFromURL(url) {
  if (!url) {
    return null;
  }
  const sellers = _.keys(config.sellers);
  return _.find(sellers, function(seller) {
    if (url.indexOf(config.sellers[seller].url) >=0 ) {
      return seller;
    }
  });
}

function getVideoSiteFromURL(url) {
  const videoSites = _.keys(config.videoSites);
  const youtubeDLSites = config.youtubeDLSites;
  const locallyProcessedSite = _.find(videoSites, function(site) {
    return (url.indexOf(config.videoSites[site].url) >=0);
  });

  if (locallyProcessedSite) {
    return locallyProcessedSite;
  }

  const purlObject = urlLib.parse(url);
  const host = purlObject.host;
  return _.find(youtubeDLSites, function(youtubeDLSite) {
    return host.indexOf(youtubeDLSite) >= 0;
  });
}

function getDeepLinkURL(seller, url) {
  if (seller === 'amazon') {
    // extract ASIN from the url
    // http://stackoverflow.com/questions/1764605/scrape-asin-from-amazon-url-using-javascript
    const asin = url.match('/([a-zA-Z0-9]{10})(?:[/?]|$)');
    if (asin && asin[1]) {
      return ('http://www.amazon.in/dp/'+ asin[1]);
    }
    return url;

  } else if (seller === 'flipkart') {
    // http://nodejs.org/api/url.html
    // signature: url.parse(urlStr, [parseQueryString], [slashesDenoteHost])
    const parsedURL = urlLib.parse(url, true);
    const pidQueryString = (parsedURL.query.pid && (parsedURL.query.pid !== undefined)) ? ('?pid=' + parsedURL.query.pid) : '';
    const affiliateHost = parsedURL.host;
    if (parsedURL.pathname.indexOf('/dl') !== 0) {
      parsedURL.pathname = '/dl' + parsedURL.pathname;
    }
    affiliateHost = affiliateHost.replace('www.flipkart.com', 'dl.flipkart.com');
    const normalizedURL = parsedURL.protocol + '//' + affiliateHost + parsedURL.pathname + pidQueryString;
    return normalizedURL;

  } else if (seller === 'snapdeal') {
    //snapdeal has a few junk chars in `hash`
    //"#bcrumbSearch:AF-S%20Nikkor%2050mm%20f/1.8G"
    //so lets ignore the hash altogether and return url until pathname
    const pUrl = urlLib.parse(url, true);
    return (pUrl.protocol + '//' + pUrl.host + pUrl.pathname);
  }

  return url;
}

function getURLWithAffiliateId(url) {
  const urlSymbol = url.indexOf('?') > 0 ? '&': '?';
  const seller = getSellerFromURL(url);
  const sellerKey = config.sellers[seller].key,
  sellerValue = config.sellers[seller].value,
  sellerExtraParams = config.sellers[seller].extraParams;

  if (sellerKey && sellerValue) {
    const stringToMatch = sellerKey + '=' + sellerValue;
    let urlWithAffiliate;
    if (url.indexOf(stringToMatch) > 0) {
      urlWithAffiliate = url;
    } else {
      urlWithAffiliate = url + urlSymbol + stringToMatch;
    }

    //for snapdeal, they have a offer id param as well
    //in the config file, I've put it as a query string
    //so simply appending it here would work
    if (sellerExtraParams) {
      return urlWithAffiliate + sellerExtraParams;
    } else {
      return urlWithAffiliate;
    }
  }
  return url;
}

function increaseCounter(counterName) {
  const counterModel = mongoose.model('Counter');
  counterModel.findOne().lean().exec(function(err, doc) {
    if (!doc) {
      return;
    }
    const updateQuery = {_id: doc._id};
    const updateObject = {};
    const updateOptions = {};
    updateObject[counterName] = doc[counterName] + 1;
    counterModel.update(updateQuery, updateObject, updateOptions, function() {});
  });
}

module.exports = {
  getSellerFromURL: getSellerFromURL,
  getDeepLinkURL: getDeepLinkURL,
  getVideoSiteFromURL: getVideoSiteFromURL,
  increaseCounter: increaseCounter,
  getURLWithAffiliateId: getURLWithAffiliateId,
  getSellerJobModelInstance: function(seller) {
    const jobSellerModelName = seller + '_job';
    return mongoose.model(jobSellerModelName);
  },
  getSellerProductPriceHistoryModelInstance: function (seller) {
    return mongoose.model(seller + '_product_price_history');
  },
  getProcessingMode: function(url) {
    //2 modes. 'seller' or 'site'
    if (getVideoSiteFromURL(url)) {
      return 'site';
    }
    return 'seller';
  },
  isLegitSeller: function(seller) {
    if (!seller) {
      return false;
    }
    const sellers = _.keys(config.sellers);
    return !!_.find(sellers, function(legitSeller) {
      return seller.trim().toLowerCase() === legitSeller;
    });

  }
};
