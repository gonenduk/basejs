const ac = require('../../lib/acl');
const Boom = require('boom');

module.exports = ModelClass => {
  return class extends ModelClass {
    get(req, res, next) {
      return super.get(req, res, next);
    }
  };
};
