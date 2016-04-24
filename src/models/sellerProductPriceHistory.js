import mongoose, { Schema } from 'mongoose';
import { sellerKeys } from '../config/config';

const SellerProductPriceHistorySchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    index: true,
  },
  email: String,
  productURL: String,
  date: Date,
  price: Number,
});

sellerKeys.forEach(seller => {
  exports[`${seller}_product_price_history`] = mongoose.model(`${seller}_product_price_history`, SellerProductPriceHistorySchema);
});
