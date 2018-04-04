const Product = require('../models/product');
const ResourceItem = require('./plugins/resource-item');

class ProductHandler extends ResourceItem {
  constructor() {
    super(Product);
  }
}

module.exports = new ProductHandler();
