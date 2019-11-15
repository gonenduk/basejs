const validations = require('./resources/validations');

module.exports = {
  ':id': {
    get: (req, res, next) => {
      validations(req.user, 'readAny', 'readOwn', 'resource-public', { id: req.params.id });
      next();
    },
  },
};
