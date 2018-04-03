const MongoModel = require('./mongo-model');

const userSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["username", "password"],
    properties: {
      username: { bsonType: "string" },
      password: { bsonType: "string" }
    }
  }
};

class User extends MongoModel {
}

module.exports = new User('users', userSchema);
