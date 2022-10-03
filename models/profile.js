/* eslint-disable no-param-reassign */
const BaseModel = require('./base-model');

class ProfileModel extends BaseModel {
  constructor() {
    super('users');
  }

  getOneById(id, filter, options = {}) {
    // Get profile fields only
    options.projection = { username: 1 };
    return super.getOneById(id, filter, options);
  }
}

module.exports = new ProfileModel();
