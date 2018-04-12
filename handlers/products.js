const product = require('../models/product');
const CollectionHandler = require('./plugins/collection-handler');
const AccessControl = require('./plugins/collection-acl');

class ProductsHandler extends AccessControl(CollectionHandler) {
  constructor() {
    super(product);
  }
}

module.exports = new ProductsHandler();
