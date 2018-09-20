const Boom = require('boom');
const ac = require('../../lib/acl');

module.exports = ModelClass => class extends ModelClass {
  get(req, res, next) {
    // Access control
    const permission = ac.can(req.user.role).readAny('resource');
    if (!permission.granted) return next(Boom.forbidden('Access denied'));

    return super.get(req, res, next);
  }

  post(req, res, next) {
    // Set ownership to current user
    req.body.ownerId = req.user.id;

    // Access control
    const permission = ac.can(req.user.role).createOwn('resource');
    if (!permission.granted) return next(Boom.forbidden('Not allowed to create item'));

    return super.post(req, res, next);
  }
};
