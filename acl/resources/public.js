const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');
const baseResource = require('./base');

module.exports = {
  ...baseResource,
  get: (req, res, next) => {
    const permission = ac.can(req.user.role).readAny('public-resource');
    if (!permission.granted) throw Boom.forbidden();

    next();
  },

  ':id': {
    ...baseResource[':id'],
    get: (req, res, next) => {
      const permission = ac.can(req.user.role).readAny('public-resource');
      if (!permission.granted) throw Boom.forbidden();

      next();
    },
  },
};
