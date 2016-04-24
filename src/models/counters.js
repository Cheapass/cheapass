import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// _ = require('underscore');

const CounterSchema = new Schema({
  totalUsers: Number,
  emailsSent: Number,
  itemsTracked: Number,
});

CounterSchema.statics.initialize = (data, callback) => {
  this.find().lean().exec((err, docs) => {
    if (err) {
      const Counters = new this(data);
      Counters.save(callback);
      return;
    }
    if (!docs || (docs && !docs.length)) {
      const Counters = new this(data);
      Counters.save(callback);
      return;
    }

    callback(null, 0);
  });
};

exports.Counter = mongoose.model('Counter', CounterSchema);
