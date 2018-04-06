const product = require('../models/product');
const ResourceItem = require('./plugins/resource-item');

class ProductHandler extends ResourceItem {
  constructor() {
    super(product);
  }
}

module.exports = new ProductHandler();
