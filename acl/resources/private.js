const baseResource = require('./base');
const validations = require('./validations');

module.exports = {
  ...baseResource,
  get: (req, res, next) => {
    validations(req.user, 'readAny', '', 'resource-private', {});
    next();
  },

  ':id': {
    ...baseResource[':id'],
    get: (req, res, next) => {
      validations(req.user, 'readAny', 'readOwn', 'resource-private', { query: req.query });
      next();
    },
  },
};
