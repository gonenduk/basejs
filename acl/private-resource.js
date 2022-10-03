const PublicResource = require('./public-resource');

class PrivateResource extends PublicResource {
  getMany(req) { this.validate(req, 'read', 'resource'); }

  getOne(req) { this.validate(req, 'read', 'resource'); }
}

module.exports = PrivateResource;
