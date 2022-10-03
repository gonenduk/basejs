const PublicResource = require('./public-resource');

class PrivateResource extends PublicResource {
  getMany(req) { this.validate(req.user, 'read', 'resource', req.query); }

  getOne(req) { this.validate(req.user, 'read', 'resource', req.query); }
}

module.exports = PrivateResource;
