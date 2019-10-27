const Boom = require('@hapi/boom');
const ac = require('../lib/acl');

module.exports = {
  get: (req, res, next) => {
    const permission = ac.can(req.user.role).readAny('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  },
  post: (req, res, next) => {
    const permission = ac.can(req.user.role).createOwn('user');
    if (!permission.granted) throw Boom.forbidden('Access denied');

    next();
  },

  ':id': {
    get: (req, res, next) => {
      const permission = (req.user.id === req.params.id)
        ? ac.can(req.user.role).readOwn('user')
        : ac.can(req.user.role).readAny('user');
      if (!permission.granted) throw Boom.forbidden('Access denied');

      next();
    },
    patch: (req, res, next) => {
      const permission = (req.user.id === req.params.id)
        ? ac.can(req.user.role).updateOwn('user')
        : ac.can(req.user.role).updateAny('user');
      if (!permission.granted) throw Boom.forbidden('Access denied');

      next();
    },

    role: {
      put: (req, res, next) => {
        const permission = (req.user.id === req.params.id)
          ? ac.can(req.user.role).updateOwn('user-role')
          : ac.can(req.user.role).updateAny('user-role');
        if (!permission.granted) throw Boom.forbidden('Access denied');

        next();
      },
    },
  },
};
