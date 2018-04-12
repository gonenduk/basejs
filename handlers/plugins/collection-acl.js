const ac = require('../../lib/acl');
const Boom = require('boom');

module.exports = ModelClass => {
  return class extends ModelClass {
    get(req, res, next) {
      // Access control
      const permission = ac.can(req.user.role).readAny('resource');
      if (!permission.granted)
        return next(Boom.forbidden(`Access denied`));

      return super.get(req, res, next);
    }

    post(req, res, next) {
      // Set ownership to current user
      if (!req.body.ownerId) req.body.ownerId = req.user.id;

      // Access control
      const permission = (req.body.ownerId === req.user.id)
        ? ac.can(req.user.role).createOwn('resource')
        : ac.can(req.user.role).createAny('resource');
      if (!permission.granted)
        return next(Boom.forbidden(`Access denied`));

      return super.post(req, res, next);
    }
  };
};
