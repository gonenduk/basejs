const PrivateResource = require('./private-resource');

const privateResource = new PrivateResource('_id');

module.exports = {
  getUsers: (req) => privateResource.getMany(req),
  getUser: (req) => privateResource.getOne(req),
  updateUser: (req) => privateResource.updateOne(req),
  updateUserRole: (req) => privateResource.updateSystem(req),
};
