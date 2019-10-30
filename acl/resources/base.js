const validations = require('./validations');

module.exports = {
  post: (req, res, next) => {
    validations(req.user, '', 'createOwn', 'resource', {});
    next();
  },

  ':id': {
    patch: (req, res, next) => {
      validations(req.user, 'updateAny', 'updateOwn', 'resource', { query: req.query });
      next();
    },
    delete: (req, res, next) => {
      validations(req.user, 'deleteAny', 'deleteOwn', 'resource', { query: req.query });
      next();
    },

    owner: {
      put: (req, res, next) => {
        validations(req.user, 'updateAny', 'updateOwn', 'resource-owner', { query: req.query });
        next();
      },
    },
  },
};
