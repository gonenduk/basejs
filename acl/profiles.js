const PublicResource = require('./public-resource');

class Profiles extends PublicResource {
  getProfile(req) { this.getOne(req); }
}

module.exports = new Profiles('_id');
