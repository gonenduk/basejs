const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

module.exports = {
  put: (req, res, next) => {
    let permission = ac.can(req.user.role).updateAny('resource-owner');
    if (!permission.granted) {
      permission = ac.can(req.user.role).updateOwn('resource-owner');
      if (!permission.granted) throw Boom.forbidden();
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  },
};
