const validate = require('./validate');

module.exports = {
  get: (req, res, next) => {
    validate.anyByOwnerId(req.user, 'read', 'resource');
    next();
  },
  post: (req, res, next) => {
    validate.oneByOwnerId(req.user, 'create', 'resource');
    next();
  },

  ':id': {
    get: (req, res, next) => {
      validate.oneByOwnerId(req.user, 'read', 'resource', req.query);
      next();
    },
    patch: (req, res, next) => {
      validate.oneByOwnerId(req.user, 'update', 'resource', req.query);
      next();
    },
    delete: (req, res, next) => {
      validate.oneByOwnerId(req.user, 'delete', 'resource', req.query);
      next();
    },

    owner: {
      put: (req, res, next) => {
        validate.oneByOwnerId(req.user, 'update', 'resource-system', req.query);
        next();
      },
    },
  },
};
