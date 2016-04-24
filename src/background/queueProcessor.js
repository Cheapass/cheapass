import kue from 'kue';

function _shouldSendAlert(data, result) {
  const { currentPrice: lastKnownPrice } = data;
  const { productPrice: scrapedPrice } = result;

  if (lastKnownPrice === scrapedPrice) {
    return false;
  }

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

    const { type, data, result } = job;

    switch (type) {

    case 'scraper': {
      if (!_shouldSendAlert(data, result)) {
        return;
      }
      // TODO else make an entry in the db and send the alert depending on preference
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
