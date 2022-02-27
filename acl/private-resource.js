const validate = require('./base-validation');

module.exports = {
  getMany: (req) => validate.anyByUserRole(req.user, 'read', 'resource'),
  create: (req) => validate.anyByUserRoleOrOwnByOwnerId(req.user, 'create', 'resource'),
  getOne: (req) => validate.anyByUserRoleOrOwnByOwnerId(req.user, 'read', 'resource', req.query),
  updateOne: (req) => validate.anyByUserRoleOrOwnByOwnerId(req.user, 'update', 'resource', req.query),
  deleteOne: (req) => validate.anyByUserRoleOrOwnByOwnerId(req.user, 'delete', 'resource', req.query),
  updateOwner: (req) => validate.anyByUserRole(req.user, 'update', 'resource-system'),
};
