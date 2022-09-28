/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }] */
/* eslint class-methods-use-this: "off" */
const bcrypt = require('bcryptjs');
const util = require('util');
const logger = require('../lib/logger');
const BaseModel = require('./base-model');

const hashAsync = util.promisify(bcrypt.hash);
const compareAsync = util.promisify(bcrypt.compare);

class UserModel extends BaseModel {
  constructor() {
    super('users', { timestamps: true });
  }

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

  async updateOneById(id, item = {}, filter = {}) {
    if (item.password) {
      // Hash password
      item.password = await hashAsync(item.password, null, null);
      // Logout user to force use of new password on all devices
      item.logoutAt = new Date();
    }
    return super.updateOneById(id, item, filter);
  }

  logout(id) {
    const item = { logoutAt: new Date(), updatedAt: null };
    return super.updateOneById(id, item);
  }

  setRole(id, role) {
    const item = { role };
    return super.updateOneById(id, item);
  }
}

module.exports = new UserModel();
