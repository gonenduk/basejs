const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

module.exports = {
  post: (req, res, next) => {
    const permission = ac.can(req.user.role).createOwn('resource');
    if (!permission.granted) throw Boom.forbidden();

    next();
  },

  ':id': {
    patch: (req, res, next) => {
      let permission = ac.can(req.user.role).updateAny('resource');
      if (!permission.granted) {
        permission = ac.can(req.user.role).updateOwn('resource');
        if (!permission.granted) throw Boom.forbidden();
        req.query.filter = { ownerId: req.user.id };
      }

      next();
    },
    delete: (req, res, next) => {
      let permission = ac.can(req.user.role).deleteAny('resource');
      if (!permission.granted) {
        permission = ac.can(req.user.role).deleteOwn('resource');
        if (!permission.granted) throw Boom.forbidden();
        req.query.filter = { ownerId: req.user.id };
      }

      next();
    },

    owner: {
      put: (req, res, next) => {
        let permission = ac.can(req.user.role).updateAny('resource-owner');
        if (!permission.granted) {
          permission = ac.can(req.user.role).updateOwn('resource-owner');
          if (!permission.granted) throw Boom.forbidden();
          req.query.filter = { ownerId: req.user.id };
        }

        next();
      },
    },
  },
};
