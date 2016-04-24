export const FLIPKART = 'flipkart';
export const AMAZON_IN = 'amazonIn';
export const SNAPDEAL = 'snapdeal';
export const HEALTHKART = 'healthkart';
export const ZIVAME = 'zivame';
export const JABONG = 'jabong';
export const FABFURNISH = 'fanfurnish';
export const INFIBEAM = 'infibeam';

export const sellers = {
  [FLIPKART]: {
    label: 'Flipkart',
    hostname: 'flipkart.com',
    affiliateParams: { affid: 'aakashlpin' },
    deeplink: true,
    props: {
      userAgent: true,
    },
  },
  [AMAZON_IN]: {
    label: 'Amazon India',
    hostname: 'amazon.in',
    affiliateParams: { tag: 'cheapass0a-21' },
    deeplink: true,
    props: {
      userAgent: false,
    },
  },
  [SNAPDEAL]: {
    label: 'Snapdeal',
    hostname: 'snapdeal.com',
    affiliateParams: { aff_id: '12129', utm_source: 'aff_prog', utm_campaign: 'afts', offer_id: '17'},
    deeplink: true,
    props: {
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
    props: {
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

export const sellerKeys = Object.keys(sellers);

export function dbIdentifier(seller) {
  return `${seller}_job`;
}

import db from '../config/config';

export function getSellerModel(seller) {
  return db.model(dbIdentifier(seller));
}

export function getPriceHistoryModel(seller) {
  return db.model(`${seller}_product_price_history`);
}
