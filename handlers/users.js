const User = require('../models/user');
const ResourceCollection = require('./plugins/resource-collection');

class UsersHandler extends ResourceCollection {
  constructor() {
    super(User);
  }

  // Hide password (write only)
  async get(req, res, next) {
    req.query.projection = { password: false };
    return super.get(req, res, next);
  }
}

module.exports = new UsersHandler();