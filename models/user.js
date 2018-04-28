const MongoModel = require('./plugins/mongo-model');
const Timestamps = require('./plugins/timestamps');
const Password = require('./plugins/password');

class User extends Password(Timestamps(MongoModel)) {
  constructor() {
    super('users');
  }

  logout(id) {
    const item = { logoutAt: new Date(), updatedAt: null };
    return super.updateOneById(id, item);
  }
}

module.exports = new User();
