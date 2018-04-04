const User = require('../models/user');
const ResourceItem = require('./plugins/resource-item');

class UserHandler extends ResourceItem {
  constructor() {
    super(User);
  }

  // Hide password (write only)
  async get(req, res, next) {
    req.query.projection = { password: false };
    return super.get(req, res, next);
  }
}

module.exports = new UserHandler();
