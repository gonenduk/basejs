const Boom = require('@hapi/boom');
const ac = require('../../lib/acl');

module.exports = {
  get: (req, res, next) => {
    let permission = ac.can(req.user.role).readAny('resource');
    if (!permission.granted) {
      permission = ac.can(req.user.role).readOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  },
  patch: (req, res, next) => {
    let permission = ac.can(req.user.role).updateAny('resource');
    if (!permission.granted) {
      permission = ac.can(req.user.role).updateOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  },
  delete: (req, res, next) => {
    let permission = ac.can(req.user.role).deleteAny('resource');
    if (!permission.granted) {
      permission = ac.can(req.user.role).deleteOwn('resource');
      if (!permission.granted) throw Boom.forbidden('Access denied');
      req.query.filter = { ownerId: req.user.id };
    }

    next();
  },
};
