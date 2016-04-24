import mongoose, { Schema } from 'mongoose';

const PaymentSchema = new Schema({}, { strict: false });

exports.Payment = mongoose.model('Payment', PaymentSchema);
