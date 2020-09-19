const { validate } = require('./validations');

module.exports = {
  get: (req, res, next) => {
    validate.ownOrAnyByUserId(req.user, 'read', 'resource');
    next();
  },
  post: (req, res, next) => {
    next();
  },

  ':id': {
    get: (req, res, next) => {
      validate.ownOrAnyByUserId(req.user, 'read', 'resource', req.params.id);
      next();
    },
    patch: (req, res, next) => {
      validate.ownOrAnyByUserId(req.user, 'update', 'resource', req.params.id);
      next();
    },

    role: {
      put: (req, res, next) => {
        validate.anyByUserRole(req.user, 'update', 'resource-system');
        next();
      },
    },
  },
};
