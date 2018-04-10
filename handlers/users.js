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

  // New users must be regular users
  post(req, res, next) {
    if (req.body.role !== roles.userLevel)
      return next(Boom.forbidden("New user must have 'user' role"));
    else
      return super.post(req, res, next);
  }
}

module.exports = new UsersHandler();