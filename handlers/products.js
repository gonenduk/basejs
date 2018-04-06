const product = require('../models/product');
const ResourceCollection = require('./plugins/resource-collection');

class ProductsHandler extends ResourceCollection {
  constructor() {
    super(product);
  }
}

module.exports = new ProductsHandler();
