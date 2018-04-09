const MongoModel = require('./plugins/mongo-model');

class User extends MongoModel {
  constructor() {
    super('users');
  }
}

module.exports = new User();
