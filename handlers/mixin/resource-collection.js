const Boom = require('boom');

module.exports = function (model, handler = {}) {
  const mixin = Object.create(handler);

  mixin.get = async (req, res, next) => {
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

    // Get list of items
    try {
      res.json(await model.getAll(filter, sort, offset, limit));
    } catch (err) {
      next(err);
    }
  };

  mixin.post = async(req, res, next) => {
    // Add one item to collection
    try {
      res.status(201).json(await model.add(req.body));
    } catch (err) {
      next(err);
    }
  };

  mixin.delete = async(req, res, next) => {
    // Get filter object (in OpenAPI 3 won't need to verify it is an object)
    let filter;
    try {
      if (req.query.filter) filter = JSON.parse(req.query.filter);
    } catch (err) {
      return next(Boom.badRequest(`Invalid filter: ${err.message}`));
    }

    // Delete items from collection
    try {
      await model.deleteAll(filter);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  };

  return mixin;
};
