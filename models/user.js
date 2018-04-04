const MongoModel = require('./mongo-model');

const userSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["username"],
    properties: {
      username: { bsonType: "string" },
      password: { bsonType: "string" }
    }
  }
};

class User extends MongoModel {
  constructor() {
    super('users', userSchema);
  }
}

module.exports = new User();
