const logger = require('../../lib/logger');
const bcrypt = require('bcrypt-nodejs');
const hashAsync = Promise.promisify(bcrypt.hash);
const compareAsync = Promise.promisify(bcrypt.compare);

module.exports = ModelClass => {
  return class extends ModelClass {
    hashPassword(password) {
      try {
        return hashAsync(password, null, null);
      } catch (err) {
        logger.warn(`Cannot hash password: ${err.message}`);
        return false;
      }
    }

    validatePassword(password, hash) {
      try {
        return compareAsync(password, hash);
      } catch (err) {
        logger.warn(`Cannot validate password: ${err.message}`);
        return false;
      }
    }
  };
};
