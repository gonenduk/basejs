const ac = require('../../lib/acl');
const Boom = require('boom');

module.exports = ModelClass => {
  return class extends ModelClass {
    get(req, res, next) {
      // Access control
      let permission = ac.can(req.user.role).readAny('resource');
      if (!permission.granted) {
        permission = ac.can(req.user.role).readOwn('resource');
        if (!permission.granted)
          return next(Boom.forbidden(`Access denied`));
        req.query.filter = { ownerId: req.user.id }
      }

      return super.get(req, res, next);
    }
  };
};
