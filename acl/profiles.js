const Boom = require('@hapi/boom');
const ac = require('../lib/acl');

module.exports = {
  ':id': {
    get: (req, res, next) => {
      const permission = (req.user.id === req.params.id)
        ? ac.can(req.user.role).readOwn('public-resource')
        : ac.can(req.user.role).readAny('public-resource');
      if (!permission.granted) throw Boom.forbidden();

      next();
    },
  },
};
