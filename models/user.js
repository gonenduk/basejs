/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }] */
/* eslint class-methods-use-this: "off" */
/* eslint-disable no-param-reassign */
const bcrypt = require('bcryptjs');
const logger = require('../lib/logger');
const BaseModel = require('./base-model');

class UserModel extends BaseModel {
  constructor() {
    super('users', { timestamps: true });
  }

  validatePassword(password, hash) {
    try {
      return bcrypt.compare(password, hash);
    } catch (err) {
      logger.warn(`Cannot validate password: ${err.message}`);
      return false;
    }
  }

  getMany(filter, options = {}) {
    options.projection = { password: 0 };
    return super.getMany(filter, options);
  }

  getOneById(id) {
    const projection = { password: 0 };
    return super.getOneById(id, { projection });
  }

  async addOne(item = {}) {
    // Hash password
    if (item.password) item.password = await bcrypt.hash(item.password, 10);
    // New user role is always set to user
    item.role = 'user';
    return super.addOne(item);
  }

  async updateOneById(id, item = {}) {
    if (item.password) {
      // Hash password
      item.password = await bcrypt.hash(item.password, 10);
      // Logout user to force use of new password on all devices
      item.logoutAt = new Date();
    }
    return super.updateOneById(id, item);
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
