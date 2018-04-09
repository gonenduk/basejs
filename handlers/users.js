const user = require('../models/user');
const roles = require('../lib/roles');
const ResourceCollection = require('./plugins/resource-collection');
const Boom = require('boom');

class UsersHandler extends ResourceCollection {
  constructor() {
    super(user);
  }

  // Block non super users and hide password (write only)
  get(req, res, next) {
    if (roles.isSuperUser(req.user.role)) {
      req.query.projection = { password: false };
      return super.get(req, res, next);
    } else
      return next(Boom.forbidden('Access denied'));
  }

  // Block non super users
  post(req, res, next) {
    return super.post(req, res, next);
  }
}

module.exports = new UsersHandler();