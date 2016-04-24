import kue from 'kue';
import { getSellerModel, getPriceHistoryModel } from '../config/config';

function _shouldSendAlert(data, result) {
  const { currentPrice: lastKnownPrice } = data;
  const { productPrice: scrapedPrice } = result;

  if (lastKnownPrice === scrapedPrice) {
    return false;
  }

  // TODO build this
  return true;
}

function _getJob(id, callback) {
  kue.Job.get(id, callback);
}

export function handleJobComplete(id) {
  _getJob(id, (err, job) => {
    if (err) {
      //
    }

    const { type, data, data: {
      _id, email, currentPrice, seller, productURL,
    }, result, result: { productPrice } } = job;

    switch (type) {
    // same event will be emitted for all kue types
    // so handle by type
    case 'scraper': {
      if (!_shouldSendAlert(data, result)) {
        return;
      }
      // TODO else make an entry in the db and send the alert depending on preference
      // make the db hit immediately
      // queue the email and other alerts

      const query = { _id };
      const updateWith = {
        currentPrice: productPrice,
        alertToPrice: productPrice,
        alertFromPrice: currentPrice,
      };

      getSellerModel(seller).update(query, updateWith, {}, () => {
        job.remove();
      });

      getPriceHistoryModel(seller).create({
        jobId: _id,
        price: productPrice,
        email: email,
        productURL: productURL,
        date: new Date(),
      }, () => {});
    }

    default:

    }
  });
}

export function handleJobFailed(id) {
  _getJob(id, (err, job) => {
    if (err) {
      // logit.as('')
    }
    job.remove();
  });
}

export function handleJobError() {
  // logger.log('info', 'job error event received', {id: id});
}
