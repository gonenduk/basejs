const MongoModel = require('./plugins/mongo-model');
const Timestamps = require('./plugins/timestamps');
const Ownership = require('./plugins/ownership');

class ProductModel extends Ownership(Timestamps(MongoModel)) {
  constructor() {
    super('products');
  }
}

module.exports = new ProductModel();
