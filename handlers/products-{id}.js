const product = require('../models/product');
const ResourceItem = require('./plugins/resource-item');
const ItemOwnership = require('./plugins/item-ownership');

class ProductHandler extends ItemOwnership(ResourceItem) {
  constructor() {
    super(product);
  }
}

module.exports = new ProductHandler();
