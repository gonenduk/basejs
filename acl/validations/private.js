const validate = require('./validate');

module.exports = {
  get: (req, res, next) => {
    validate.anyByUserRole(req.user, 'read', 'resource');
    next();
  },
  post: (req, res, next) => {
    validate.anyByUserRoleOrOwnByOwnerId(req.user, 'create', 'resource');
    next();
  },

  ':id': {
    get: (req, res, next) => {
      validate.anyByUserRoleOrOwnByOwnerId(req.user, 'read', 'resource', req.query);
      next();
    },
    patch: (req, res, next) => {
      validate.anyByUserRoleOrOwnByOwnerId(req.user, 'update', 'resource', req.query);
      next();
    },
    delete: (req, res, next) => {
      validate.anyByUserRoleOrOwnByOwnerId(req.user, 'delete', 'resource', req.query);
      next();
    },

    owner: {
      put: (req, res, next) => {
        validate.anyByUserRole(req.user, 'update', 'resource-system');
        next();
      },
    },
  },
};
