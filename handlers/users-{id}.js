const User = require('../models/user');
const Boom = require('boom');

module.exports = {
  get: async (req, res, next) => {
    // Get id
    const id = req.query.limit;

    // Get list of users
    try {
      const user = await User.getById(id);
      if (!user) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.json(user);
    }
    catch (err) {
      next(err);
    }
  }
};
