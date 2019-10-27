const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

module.exports = {
  get: (req, res, next) => {
    // Access control
    const permission = ac.can(req.user.role).readAny('resource');
    if (!permission.granted) throw Boom.forbidden();

    next();
  },
  post: (req, res, next) => {
    const permission = ac.can(req.user.role).createOwn('resource');
    if (!permission.granted) throw Boom.forbidden();

    next();
  },
};
