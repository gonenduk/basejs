const { validate } = require('./validations');

module.exports = {
  ':id': {
    get: (req, res, next) => {
      validate.ownOrAnyByUserId(req.user, 'read', 'resource-public', req.params.id);
      next();
    },
  },
};
