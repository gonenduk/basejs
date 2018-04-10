const MongoModel = require('./plugins/mongo-model');
const Timestamps = require('./plugins/timestamps');
const roles = require('../lib/roles');

class User extends Timestamps(MongoModel) {
  constructor() {
    super('users');
  }

  addOne(item = {}) {
    // Default user role
    if (!item.role) item.role = roles.userLevel;
    return super.addOne(item);
  }
}

module.exports = new User();
