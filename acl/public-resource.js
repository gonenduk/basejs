const baseValidation = require('./base-validation');

class PublicResource {
  constructor(userIdField = 'ownerId') {
    this.validate = baseValidation[userIdField];
  }

  getMany(req) { this.validate(req.user, 'read', 'resource-public', req.query); }

  create(req) { this.validate(req.user, 'create', 'resource', req.query); }

  getOne(req) { this.validate(req.user, 'read', 'resource-public', req.query); }

  updateOne(req) { this.validate(req.user, 'update', 'resource', req.query); }

  deleteOne(req) { this.validate(req.user, 'delete', 'resource', req.query); }

  updateSystem(req) { this.validate(req.user, 'update', 'resource-system', req.query); }
}

module.exports = PublicResource;
