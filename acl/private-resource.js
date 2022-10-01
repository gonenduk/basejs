const validate = require('./base-validation');
const publicResource = require('./public-resource');

module.exports = {
  ...publicResource,
  getMany: (req) => validate.anyByUserRole(req.user, 'read', 'resource'),
  getOne: (req) => validate.anyByUserRoleOrOwnByOwnerId(req.user, 'read', 'resource', req.query),
};
