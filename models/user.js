const MongoModel = require('./mongo-model');

class User extends MongoModel {
  constructor() {
    super('users');
  }
}

module.exports = new User();
