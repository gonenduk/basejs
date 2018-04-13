const MongoModel = require('./plugins/mongo-model');
const Timestamps = require('./plugins/timestamps');
const Password = require('./plugins/password');

class User extends Password(Timestamps(MongoModel)) {
  constructor() {
    super('users');
  }
}

module.exports = new User();
