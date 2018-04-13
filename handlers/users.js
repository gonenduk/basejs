const user = require('../models/user');
const ac = require('../lib/acl');
const bcrypt = require('bcrypt-nodejs');
const CollectionHandler = require('./plugins/collection-handler');
const Boom = require('boom');
const hashAsync = Promise.promisify(bcrypt.hash);

class UsersHandler extends CollectionHandler {
  constructor() {
    super(user);
  }

  get(req, res, next) {
    // Access control
    const permission = ac.can(req.user.role).readAny('user');
    if (!permission.granted)
      return next(Boom.forbidden(`Access denied`));

    // Hide password (write only)
    req.query.projection = { password: false };

    return super.get(req, res, next);
  }

  async post(req, res, next) {
    // Access control
    const permission = ac.can(req.user.role).createOwn('user');
    if (!permission.granted)
      return next(Boom.forbidden(`Access denied`));

    // Set of role
    if (req.body.role && req.body.role !== 'user' && permission.attributes.indexOf('!role') > -1)
      return next(Boom.forbidden(`Not allowed to set role`));

    // Hash password
    if (req.body.password) {
      req.body.password = await user.hashPassword(req.body.password);
      if (!req.body.password)
        return next(Boom.internal('Failed to hash password'));
    }

    return super.post(req, res, next);
  }
}

module.exports = new UsersHandler();
