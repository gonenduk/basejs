const Boom = require('boom');
const user = require('../models/user');
const ac = require('../lib/acl');
const CollectionHandler = require('./plugins/collection-handler');

class UsersHandler extends CollectionHandler {
  constructor() {
    super(user);
  }

  get(req, res, next) {
    // Access control
    const permission = ac.can(req.user.role).readAny('user');
    if (!permission.granted) return next(Boom.forbidden('Access denied'));

    // Hide password (write only)
    req.query.projection = { password: 0 };

    return super.get(req, res, next);
  }

  post(req, res, next) {
    // Access control
    const permission = ac.can(req.user.role).createOwn('user');
    if (!permission.granted) return next(Boom.forbidden('Access denied'));

    // New user role is always set to user
    req.body.role = 'user';

    return super.post(req, res, next);
  }
}

module.exports = new UsersHandler();
