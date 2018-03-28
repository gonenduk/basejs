const db = require('../lib/mongodb');
const Schema = db.base.Schema;

const productSchema = new Schema({
  price: Number,
  title: String
});

productSchema.statics.getById = function(id) {
  return this.findById(id).exec().catch((err) => console.log(err.message));
};

productSchema.statics.getAll = function(filter = {}, sort = {}, offset = 0, limit = 20) {
  return this.find(filter).sort(sort).skip(offset).limit(limit).exec();
};

module.exports = db.model('Product', productSchema);
