const Boom = require('boom');
const user = require('../models/user');
const ac = require('../lib/acl');

class UserRoleHandler {
  constructor(model) {
    this.model = model;
  }

  async put(req, res, next) {
    if (req.pathParams.id === 'me') req.pathParams.id = req.user.id;

    // Access control
    const permission = (req.user.id === req.pathParams.id)
      ? ac.can(req.user.role).updateOwn('user-role')
      : ac.can(req.user.role).updateAny('user-role');
    if (!permission.granted) return next(Boom.forbidden('Access denied'));

    // Update item owner
    const item = await this.model.setRole(req.pathParams.id, req.body);
    if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
    return res.status(204).end();
  }
}

module.exports = new UserRoleHandler(user);
