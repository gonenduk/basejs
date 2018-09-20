const Boom = require('boom');
const ac = require('../../lib/acl');

module.exports = ModelClass => class extends ModelClass {
  put(req, res, next) {
    // Access control
    let permission = ac.can(req.user.role).updateAny('resource-owner');
    if (!permission.granted) {
      permission = ac.can(req.user.role).updateOwn('resource-owner');
      if (!permission.granted) return next(Boom.forbidden('Access denied'));
      req.query.filter = { ownerId: req.user.id };
    }

    return super.put(req, res, next);
  }
};
