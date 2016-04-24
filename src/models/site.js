import mongoose, { Schema } from 'mongoose';

const SiteSchema = new Schema({
  site: String,
  url: String,
});

// SiteSchema.statics.post = function(data, callback) {
//   var Site = new this(data);
//   Site.save(callback);
// };

exports.Site = mongoose.model('Site', SiteSchema);
