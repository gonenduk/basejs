const user = require('../models/user');
const roles = require('../lib/roles');
const ResourceItem = require('./plugins/resource-item');
const Boom = require('boom');

class UserHandler extends ResourceItem {
  constructor() {
    super(user);
  }

  // Block normal users from viewing other users and hide password (write only)
  async get(req, res, next) {
    if (req.pathParams.id === 'me') req.pathParams.id = req.user.id;

    if (req.pathParams.id === req.user.id || roles.isSuperUser(req.user.role)) {
      req.query.projection = { password: false };
      return super.get(req, res, next);
    } else
      return next(Boom.forbidden('Access denied'));
  }
}

module.exports = new UserHandler();
