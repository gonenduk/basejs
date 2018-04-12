const MongoModel = require('./plugins/mongo-model');
const Timestamps = require('./plugins/timestamps');

class User extends Timestamps(MongoModel) {
  constructor() {
    super('users');
  }
}

module.exports = new User();
