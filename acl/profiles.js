const validate = require('./base-validation');

module.exports = {
  getProfile: (req) => validate.ownOrAnyByUserId(req.user, 'read', 'resource-public', req.params.id),
};
