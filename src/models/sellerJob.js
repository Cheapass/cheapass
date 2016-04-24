import mongoose, { Schema } from 'mongoose';
import { sellerKeys, dbIdentifier } from '../config/config';

const ProductPriceHistorySchema = new Schema({
  date: Date,
  price: Number,
}, {_id: false});

const SellerJobSchema = new Schema({
  email: {type: String, index: true},
  source: String,
  productURL: String,
  productName: String,
  productImage: String,
  currentPrice: Number,
  targetPrice: Number,
  alertToPrice: Number,
  alertFromPrice: Number,
  productPriceHistory: [ProductPriceHistorySchema],
});

SellerJobSchema.index({email: 1, productURL: 1});

sellerKeys.forEach(seller => {
  exports[dbIdentifier(seller)] = mongoose.model(dbIdentifier(seller), SellerJobSchema);
});
