const validate = require('./base-validation');

module.exports = {
  getUsers: (req) => validate.ownOrAnyByUserId(req.user, 'read', 'resource'),
  getUser: (req) => validate.ownOrAnyByUserId(req.user, 'read', 'resource', req.params.id),
  updateUser: (req) => validate.ownOrAnyByUserId(req.user, 'update', 'resource', req.params.id),
  updateUserRole: (req) => validate.anyByUserRole(req.user, 'update', 'resource-system'),
};
