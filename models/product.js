const MongoModel = require('./mongo-model');

class ProductModel extends MongoModel {
}

module.exports = new ProductModel('products');
