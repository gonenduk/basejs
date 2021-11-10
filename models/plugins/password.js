/* eslint-disable default-param-last */
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }] */
/* eslint class-methods-use-this: "off" */
const bcrypt = require('bcryptjs');
const util = require('util');
const logger = require('../../lib/logger');

const hashAsync = util.promisify(bcrypt.hash);
const compareAsync = util.promisify(bcrypt.compare);

module.exports = (ModelClass) => class extends ModelClass {
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
