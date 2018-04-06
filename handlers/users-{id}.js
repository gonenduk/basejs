const user = require('../models/user');
const ResourceItem = require('./plugins/resource-item');

class UserHandler extends ResourceItem {
  constructor() {
    super(user);
  }

  // Hide password (write only)
  async get(req, res, next) {
    req.query.projection = { password: false };
    return super.get(req, res, next);
  }
}

module.exports = new UserHandler();
