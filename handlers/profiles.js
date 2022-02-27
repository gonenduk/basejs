const BaseHandler = require('./base-handler');
const model = require('../models/user');

const baseHandler = new BaseHandler(model);

module.exports = {
  getProfile: (req, res) => {
    // Get profile fields only
    req.query.projection = { username: 1 };

    return baseHandler.getOne(req, res);
  },
};
