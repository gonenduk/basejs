const Product = require('../models/product');
const Boom = require('boom');

module.exports = {
  get: async (req, res, next) => {
    // Get filter and sort objects (in OpenAPI 3 won't need to verify they are objects)
    let filter, sort, operation;
    try {
      operation = 'filter';
      if (req.query.filter) filter = JSON.parse(req.query.filter);
      operation = 'sort';
      if (req.query.sort) sort = JSON.parse(req.query.sort);
    } catch (err) {
      return next(Boom.badRequest(`Invalid ${operation}: ${err.message}`));
    }

    // Get offset and limit
    const offset = req.query.offset;
    const limit = req.query.limit;

    // Get list of products
    try {
      res.json(await Product.getAll(filter, sort, offset, limit));
    }
    catch (err) {
      next(err);
    }
  }
};
