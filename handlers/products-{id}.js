const product = require('../models/product');
const ResourceItem = require('./plugins/resource-item');
const AccessControl = require('./plugins/accesscontrol');

class ProductHandler extends AccessControl(ResourceItem) {
  constructor() {
    super(product);
  }
}

module.exports = new ProductHandler();
