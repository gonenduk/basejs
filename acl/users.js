const validate = require('./resources/validate');

module.exports = {
  get: (req, res, next) => {
    validate.byUserId(req.user, 'read', 'resource-private');
    next();
  },
  post: (req, res, next) => {
    next();
  },

  ':id': {
    get: (req, res, next) => {
      validate.byUserId(req.user, 'read', 'resource-private', req.params.id);
      next();
    },
    patch: (req, res, next) => {
      validate.byUserId(req.user, 'update', 'resource', req.params.id);
      next();
    },

    role: {
      put: (req, res, next) => {
        validate.byUserId(req.user, 'update', 'resource-system', req.params.id);
        next();
      },
    },
  },
};
