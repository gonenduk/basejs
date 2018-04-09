const Boom = require('boom');

module.exports = ResourceClass => {
  return class extends ResourceClass {
    post(req, res, next) {
      // Set ownership of current user
      req.body.ownerId = req.user.id;
      return super.post(req, res, next);
    }
  };
};
