const BaseModel = require('./base-model');

class ProfileModel extends BaseModel {
  constructor() {
    super('users');
  }

  getOneById(id) {
    // Get profile fields only
    const projection = { username: 1 };
    return super.getOneById(id, { projection });
  }
}

module.exports = new ProfileModel();
