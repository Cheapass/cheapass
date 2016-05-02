import queue from './queue';
import db from '../background/dbConnection';
import { sellers, sellerKeys, dbIdentifier } from '../config/config';
import {scraper} from '../controllers/scraper';

function streamProductsFromDbToMemory() {
  // TODO not sure if forEach is the right way to go
  // check the performance
  //
  /* eslint-disable no-console */
  sellerKeys
  .filter(seller => seller === 'flipkart')
  .forEach(seller => {
    const SellerDbModel = db.model(dbIdentifier(seller));
    // TODO remove this filter
    const stream = SellerDbModel.find({}, {productPriceHistory: 0}).limit(100).stream();

    stream.on('data', product => {
      queue.create('scraper', {
        ...product,
        title: `${product.productName} on ${sellers[seller].label}`,
      }).save((err) => {
        if (err) {
          console.log(err);
        }
      });
    });

    stream.on('error', err => {
      console.log(err);
    });
  });
}

function queueTasksIfRequired() {
  queue.inactiveCount('scraper', (err, inactiveJobs) => {
    if (!inactiveJobs) {
      console.log('queueing tasks from db to memory');
      streamProductsFromDbToMemory();
    }
  });
}

function processQueuedTasks() {
  queue.process('scraper', 4, async (job, done) => {
    const { productURL } = job.data._doc;
    try {
      const scrapedData = await scraper({
        url: productURL,
      });
      const { data } = scrapedData;
      if (data.error) {
        return done(data.error);
      }

      done(null, scrapedData);
    } catch (error) {
      done(error);
    }
  });
}

const tasks = {
  run: () => {
    setInterval(() => {
      queueTasksIfRequired();
    }, 60000 /* check every minute */);

    queueTasksIfRequired();
    processQueuedTasks();
  },
};

export default tasks;
