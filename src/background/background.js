import queue from './queue';
import db from '../background/dbConnection';
import {sellers, sellerKeys, dbIdentifier} from '../config/config';

function streamProductsFromDbToMemory() {
  // TODO not sure if forEach is the right way to go
  // check the performance
  //
  /* eslint-disable no-console */
  sellerKeys.forEach(seller => {
    const SellerDbModel = db.model(dbIdentifier(seller));
    const stream = SellerDbModel.find({}, {productPriceHistory: 0}).stream();

    stream.on('data', product => {
      queue.create('scraper', {
        ...product,
        seller,
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

const tasks = {
  run: () => {
    queue.inactiveCount('scraper', (err, inactiveJobs) => {
      if (!inactiveJobs) {
        streamProductsFromDbToMemory();
      }
    });
  },
};

export default tasks;
