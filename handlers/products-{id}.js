const product = require('../models/product');
const ItemHandler = require('./plugins/item-handler');
const AccessControl = require('./plugins/item-acl');

class ProductHandler extends AccessControl(ItemHandler) {
  constructor() {
    super(product);
  }
}

module.exports = new ProductHandler();
