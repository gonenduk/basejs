const product = require('../models/product');
const ResourceCollection = require('./plugins/resource-collection');
const CollectionOwnership = require('./plugins/collection-ownership');

class ProductsHandler extends CollectionOwnership(ResourceCollection) {
  constructor() {
    super(product);
  }
}

module.exports = new ProductsHandler();
