const db = require('../lib/mongodb');
const crud = require('./plugins/crud');
const Schema = db.base.Schema;

const productSchema = new Schema({
  price: Number,
  title: String
});

productSchema.plugin(crud);

module.exports = db.model('Product', productSchema);
