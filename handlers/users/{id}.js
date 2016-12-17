const Boom = require('boom');

module.exports = {
  get: (req, res, next) => {
    next(Boom.notFound('User not found'));
  }
};
