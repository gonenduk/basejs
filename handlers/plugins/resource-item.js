const Boom = require('boom');

class ResourceItem {
  constructor(model) {
    this.model = model;
  }

  async get(req, res, next) {
    // Get id and projection
    const id = req.pathParams.id;
    const projection = req.query.projection;

    // Get item
    try {
      const item = await this.model.getOneById(id, projection);
      if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.json(item);
    }
    catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    // Get id
    const id = req.pathParams.id;

    // Delete item
    try {
      const item = await this.model.deleteOneById(id);
      if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.status(204).end();
    }
    catch (err) {
      next(err);
    }
  }

  async put(req, res, next) {
    // Get id
    const id = req.pathParams.id;

    // Update item
    try {
      const item = await this.model.updateOneById(id, req.body);
      if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.status(204).end();
    }
    catch (err) {
      next(err);
    }
  }
}

module.exports = ResourceItem;
