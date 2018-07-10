const Boom = require('boom');

class CollectionHandler {
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
    const limit = req.query.limit || 20;
    const projection = req.query.projection;

    // Get list of items
    res.json(await this.model.getMany(filter, { sort, skip, limit, projection }));
  }

  async post(req, res, next) {
    // Add one item to collection
    const item = await this.model.addOne(req.body);
    res.status(201).location(`${req.originalUrl}/${item._id}`).json(item);
  }

  async patch(req, res, next) {
    // Get filter object (in OpenAPI 3 won't need to verify they are objects)
    let filter;
    try {
      if (req.query.filter) filter = JSON.parse(req.query.filter);
    } catch (err) {
      return next(Boom.badRequest(`Invalid filter: ${err.message}`));
    }

    // Update list of items
    await this.model.updateMany(filter, req.body);
    res.status(204).end();
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
    await this.model.deleteMany(filter);
    res.status(204).end();
  }
}

module.exports = CollectionHandler;
