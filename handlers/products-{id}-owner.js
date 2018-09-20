const product = require('../models/product');
const ItemOwnerHandler = require('./plugins/item-owner-handler');
const AccessControl = require('./plugins/item-owner-acl');

class ProductHandler extends AccessControl(ItemOwnerHandler) {
  constructor() {
    super(product);
  }
}

module.exports = new ProductHandler();
