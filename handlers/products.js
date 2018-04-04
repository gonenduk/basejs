const Product = require('../models/product');
const ResourceCollection = require('./plugins/resource-collection');

class ProductsHandler extends ResourceCollection {
  constructor() {
    super(Product);
  }
}

module.exports = new ProductsHandler();
