const Boom = require('@hapi/boom');
const ac = require('../lib/acl');

module.exports = {
  get: (req, res, next) => {
    const permission = ac.can(req.user.role).readAny('private-resource');
    if (!permission.granted) throw Boom.forbidden();

    next();
  },
  post: (req, res, next) => {
    const permission = ac.can(req.user.role).createOwn('user');
    if (!permission.granted) throw Boom.forbidden();

    next();
  },

  ':id': {
    get: (req, res, next) => {
      const permission = (req.user.id === req.params.id)
        ? ac.can(req.user.role).readOwn('private-resource')
        : ac.can(req.user.role).readAny('private-resource');
      if (!permission.granted) throw Boom.forbidden();

      next();
    },
    patch: (req, res, next) => {
      const permission = (req.user.id === req.params.id)
        ? ac.can(req.user.role).updateOwn('private-resource')
        : ac.can(req.user.role).updateAny('private-resource');
      if (!permission.granted) throw Boom.forbidden();

      next();
    },

    role: {
      put: (req, res, next) => {
        const permission = (req.user.id === req.params.id)
          ? ac.can(req.user.role).updateOwn('user-role')
          : ac.can(req.user.role).updateAny('user-role');
        if (!permission.granted) throw Boom.forbidden();

        next();
      },
    },
  },
};
