const baseValidation = require('./base-validation');

class PublicResource {
  constructor(userIdField = 'ownerId') {
    this.validate = baseValidation[userIdField];
  }

  getMany(req) { this.validate(req, 'read', 'resource-public'); }

  create(req) { this.validate(req, 'create', 'resource'); }

  getOne(req) { this.validate(req, 'read', 'resource-public'); }

  updateOne(req) { this.validate(req, 'update', 'resource'); }

  deleteOne(req) { this.validate(req, 'delete', 'resource'); }

  updateSystem(req) { this.validate(req, 'update', 'resource-system'); }
}

module.exports = PublicResource;
