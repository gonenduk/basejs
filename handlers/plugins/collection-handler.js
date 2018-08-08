/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const Boom = require('boom');

class CollectionHandler {
  constructor(model) {
    this.model = model;
  }

  async get(req, res, next) {
    // Get filter and sort objects (in OpenAPI 3 won't need to verify they are objects)
    let filter;
    let sort;
    let operation;
    try {
      operation = 'filter';
      if (req.query.filter) filter = JSON.parse(req.query.filter);
      operation = 'sort';
      if (req.query.sort) sort = JSON.parse(req.query.sort);
    } catch (err) {
      return next(Boom.badRequest(`Invalid ${operation}: ${err.message}`));
    }

    // Get skip and limit
    const { skip, limit = 20, projection } = req.query;

    // Get list of items
    return res.json(await this.model.getMany(filter, {
      sort, skip, limit, projection,
    }));
  }

  async post(req, res) {
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
    return res.status(204).end();
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
    return res.status(204).end();
  }
}

module.exports = CollectionHandler;
