const Boom = require('boom');
const user = require('../models/user');
const ac = require('../lib/acl');
const ItemHandler = require('./plugins/item-handler');

class UserHandler extends ItemHandler {
  constructor() {
    super(user);
  }

  get(req, res, next) {
    if (req.pathParams.id === 'me') req.pathParams.id = req.user.id;

    // Access control
    const permission = (req.user.id === req.pathParams.id)
      ? ac.can(req.user.role).readOwn('profile')
      : ac.can(req.user.role).readAny('profile');
    if (!permission.granted) return next(Boom.forbidden('Access denied'));

    // Get profile fields only
    req.query.projection = { username: 1 };

    return super.get(req, res, next);
  }
}

module.exports = new UserHandler();
