const ac = require('../../lib/acl');
const Boom = require('boom');

module.exports = ModelClass => {
  return class extends ModelClass {
    get(req, res, next) {
      // Access control

      return super.get(req, res, next);
    }
  };
};
