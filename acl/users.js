const validations = require('./resources/validations');

module.exports = {
  get: (req, res, next) => {
    validations(req.user, 'readAny', '', 'resource-private', {});
    next();
  },
  post: (req, res, next) => {
    next();
  },

  ':id': {
    get: (req, res, next) => {
      validations(req.user, 'readAny', 'readOwn', 'resource-private', { id: req.params.id });
      next();
    },
    patch: (req, res, next) => {
      validations(req.user, 'updateAny', 'updateOwn', 'resource', { id: req.params.id });
      next();
    },

    role: {
      put: (req, res, next) => {
        validations(req.user, 'updateAny', 'updateOwn', 'resource-system', { id: req.params.id });
        next();
      },
    },
  },
};
