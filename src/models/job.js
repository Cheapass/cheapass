import mongoose, { Schema } from 'mongoose';

const JobSchema = new Schema({
  email: {type: String, index: true},
  seller: String,
  productURL: String,
  productName: String,
  productImage: String,
  currentPrice: Number,
  isActive: Boolean,
  isReminded: Boolean,
  source: String,
});

exports.Job = mongoose.model('Job', JobSchema);
