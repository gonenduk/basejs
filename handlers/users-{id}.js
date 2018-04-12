const user = require('../models/user');
const ac = require('../lib/acl');
const bcrypt = require('bcrypt-nodejs');
const ItemHandler = require('./plugins/item-handler');
const Boom = require('boom');
const hashAsync = Promise.promisify(bcrypt.hash);

class UserHandler extends ItemHandler {
  constructor() {
    super(user);
  }

  get(req, res, next) {
    if (req.pathParams.id === 'me') req.pathParams.id = req.user.id;

    // Access control
    const permission = (req.user.id === req.pathParams.id)
      ? ac.can(req.user.role).readOwn('user')
      : ac.can(req.user.role).readAny('user');
    if (!permission.granted)
      return next(Boom.forbidden(`Access denied`));

    // Hide password (write only)
    req.query.projection = { password: false };

    return super.get(req, res, next);
  }

  async patch(req, res, next) {
    if (req.pathParams.id === 'me') req.pathParams.id = req.user.id;

    // Access control
    const permission = (req.user.id === req.pathParams.id)
      ? ac.can(req.user.role).updateOwn('user')
      : ac.can(req.user.role).updateAny('user');
    if (!permission.granted)
      return next(Boom.forbidden(`Access denied`));

    // Change of role
    if (req.body.role && permission.attributes.indexOf('!role') > -1)
      return next(Boom.forbidden(`Not allowed to change role`));

    // Hash password
    if (req.body.password) {
      try {
        req.body.password = await hashAsync(req.body.password, null, null);
      } catch (err) {
        return next(Boom.internal(err.message));
      }
    }

    return super.patch(req, res, next);
  }
}

module.exports = new UserHandler();
