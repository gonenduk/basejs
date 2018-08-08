/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }] */
/* eslint class-methods-use-this: "off" */
const bcrypt = require('bcrypt-nodejs');
const logger = require('../../lib/logger');

const hashAsync = Promise.promisify(bcrypt.hash);
const compareAsync = Promise.promisify(bcrypt.compare);

module.exports = ModelClass => class extends ModelClass {
  validatePassword(password, hash) {
    try {
      return compareAsync(password, hash);
    } catch (err) {
      logger.warn(`Cannot validate password: ${err.message}`);
      return false;
    }
  }

  async addOne(item = {}) {
    // Hash password
    if (item.password) item.password = await hashAsync(item.password, null, null);
    return super.addOne(item);
  }

  async updateOneById(id, item = {}, filter) {
    if (item.password) {
      // Hash password
      item.password = await hashAsync(item.password, null, null);
      // Logout user to force use of new password on all devices
      item.logoutAt = new Date();
    }
    return super.updateOneById(id, item, filter);
  }
};
