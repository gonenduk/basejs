const validations = require('./resources/validations');

module.exports = {
  get: (req, res, next) => {
    validations(req.user, 'readAny', '', 'private-resource', {});
    next();
  },
  post: (req, res, next) => {
    next();
  },

  ':id': {
    get: (req, res, next) => {
      validations(req.user, 'readAny', 'readOwn', 'private-resource', { id: req.params.id });
      next();
    },
    patch: (req, res, next) => {
      validations(req.user, 'updateAny', 'updateOwn', 'resource', { id: req.params.id });
      next();
    },

    role: {
      put: (req, res, next) => {
        validations(req.user, 'updateAny', 'updateOwn', 'user-role', { id: req.params.id });
        next();
      },
    },
  },
};
