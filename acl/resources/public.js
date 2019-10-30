const baseResource = require('./base');
const validations = require('./validations');

module.exports = {
  ...baseResource,
  get: (req, res, next) => {
    validations(req.user, 'readAny', '', 'public-resource', {});
    next();
  },

  ':id': {
    ...baseResource[':id'],
    get: (req, res, next) => {
      validations(req.user, 'readAny', '', 'public-resource', {});
      next();
    },
  },
};
