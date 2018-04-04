const Boom = require('boom');

class ResourceCollection {
  constructor(model) {
    this.model = model;
  }

  async get(req, res, next) {
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

    // Get skip and limit
    const skip = req.query.skip;
    const limit = req.query.limit;

    // Get list of items
    try {
      res.json(await this.model.getAll(filter, sort, skip, limit));
    } catch (err) {
      next(err);
    }
  }

  async post(req, res, next) {
    // Add one item to collection
    try {
      res.status(201).json(await this.model.addOne(req.body));
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    // Get filter object (in OpenAPI 3 won't need to verify it is an object)
    let filter;
    try {
      if (req.query.filter) filter = JSON.parse(req.query.filter);
    } catch (err) {
      return next(Boom.badRequest(`Invalid filter: ${err.message}`));
    }

    // Delete items from collection
    try {
      await this.model.deleteAll(filter);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ResourceCollection;
