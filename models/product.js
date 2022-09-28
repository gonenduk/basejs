const BaseModel = require('./base-model');

class ProductModel extends BaseModel {
  constructor() {
    super('products', { ownership: true, timestamps: true });
  }
}

module.exports = new ProductModel();
