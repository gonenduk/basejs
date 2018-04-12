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

    patch(req, res, next) {
      // Access control
      let permission = ac.can(req.user.role).updateAny('resource');
      if (!permission.granted) {
        permission = ac.can(req.user.role).updateOwn('resource');
        if (!permission.granted)
          return next(Boom.forbidden(`Access denied`));
        req.query.filter = { ownerId: req.user.id }
      }

      // Change of ownerId
      if (req.body.ownerId && permission.attributes.indexOf('!ownerId') > -1)
        return next(Boom.forbidden(`Not allowed to change ownerId`));

      return super.patch(req, res, next);
    }

    delete(req, res, next) {
      // Access control
      let permission = ac.can(req.user.role).deleteAny('resource');
      if (!permission.granted) {
        permission = ac.can(req.user.role).deleteOwn('resource');
        if (!permission.granted)
          return next(Boom.forbidden(`Access denied`));
        req.query.filter = { ownerId: req.user.id }
      }

      return super.delete(req, res, next);
    }
  };
};
