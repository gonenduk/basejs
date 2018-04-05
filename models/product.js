const MongoModel = require('./mongo-model');

class ProductModel extends MongoModel {
  constructor() {
    super('products');
  }
}

module.exports = new ProductModel();
