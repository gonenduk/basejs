const PublicResource = require('./public-resource');

const publicResource = new PublicResource('_id');

module.exports = {
  getProfile: (req) => publicResource.getOne(req),
};
