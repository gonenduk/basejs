const validate = require('./resources/validate');

module.exports = {
  ':id': {
    get: (req, res, next) => {
      validate.byUserId(req.user, 'read', 'resource-public', req.params.id);
      next();
    },
  },
};
