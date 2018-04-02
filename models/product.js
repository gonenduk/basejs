const db = require('../lib/mongoose');
const crud = require('./plugins/crud');
const hideVersion = require('./plugins/hide-version');
const Schema = db.base.Schema;

const productSchema = new Schema({
  title: String,
  price: Number
});

productSchema.plugin(crud);
productSchema.plugin(hideVersion);

module.exports = db.model('Product', productSchema);
