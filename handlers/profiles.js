const BaseHandler = require('./base-handler');
const model = require('../models/profile');

const baseHandler = new BaseHandler(model);

module.exports = {
  getProfile: (req, res) => baseHandler.getOne(req, res),
};
