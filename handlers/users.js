const Boom = require('@hapi/boom');
const BaseHandler = require('./base-handler');
const model = require('../models/user');

const baseHandler = new BaseHandler(model);

module.exports = {
  getUsers: (req, res) => {
    // Hide password (write only)
    req.query.projection = { password: 0 };

    return baseHandler.getMany(req, res);
  },

  createUser: (req, res) => baseHandler.create(req, res),

  getUser: (req, res) => {
    // Hide password (write only)
    req.query.projection = { password: 0 };

    return baseHandler.getOne(req, res);
  },

  updateUser: (req, res) => baseHandler.updateOne(req, res),

  updateUserRole: async (req, res) => {
    // Update item owner
    const item = await model.setRole(req.params.id, req.body);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.status(204).end();
  },
};
