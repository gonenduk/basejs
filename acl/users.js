const PrivateResource = require('./private-resource');

class Users extends PrivateResource {
  getUsers(req) { this.getMany(req); }

  getUser(req) { this.getOne(req); }

  updateUser(req) { this.updateOne(req); }

  updateUserRole(req) { this.updateSystem(req); }
}

module.exports = new Users('_id');
