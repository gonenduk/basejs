const logger = require('../lib/logger');
const MongoModel = require('./plugins/mongo-model');
const Timestamps = require('./plugins/timestamps');
const bcrypt = require('bcrypt-nodejs');
const hashAsync = Promise.promisify(bcrypt.hash);
const compareAsync = Promise.promisify(bcrypt.compare);

class User extends Timestamps(MongoModel) {
  constructor() {
    super('users');
  }

  hashPassword(password) {
    try {
      return hashAsync(password, null, null);
    } catch (err) {
      logger.error(`Cannot validate password: ${err.message}`);
      return false;
    }
  }

  validatePassword(password, hash) {
    try {
      return compareAsync(password, hash);
    } catch (err) {
      logger.error(`Cannot validate password: ${err.message}`);
      return false;
    }
  }
}

module.exports = new User();
