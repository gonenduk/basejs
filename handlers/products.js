const product = require('../models/product');
const ResourceCollection = require('./plugins/resource-collection');
const AccessControl = require('./plugins/accesscontrol');

class ProductsHandler extends AccessControl(ResourceCollection) {
  constructor() {
    super(product);
  }
}

module.exports = new ProductsHandler();
