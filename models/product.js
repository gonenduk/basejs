const MongoModel = require('./mongo-model');

const productSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["title", "price"],
    properties: {
      title: { bsonType: "string" },
      price: { bsonType: "number" }
    }
  }
};

class ProductModel extends MongoModel {
  constructor() {
    super('products', productSchema);
  }
}

module.exports = new ProductModel();
