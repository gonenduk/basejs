const Boom = require('boom');

class ItemHandler {
  constructor(model) {
    this.model = model;
  }

  async get(req, res, next) {
    // Get id, projection and filter
    const id = req.pathParams.id;
    const projection = req.query.projection;
    const filter = req.query.filter;

    // Get item
    try {
      const item = await this.model.getOneById(id, projection, filter);
      if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.json(item);
    }
    catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    // Get id and filter
    const id = req.pathParams.id;
    const filter = req.query.filter;

    // Delete item
    try {
      const item = await this.model.deleteOneById(id, filter);
      if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.status(204).end();
    }
    catch (err) {
      next(err);
    }
  }

  async patch(req, res, next) {
    // Get id and filter
    const id = req.pathParams.id;
    const filter = req.query.filter;

    // Update item fields
    try {
      const item = await this.model.updateOneById(id, req.body, filter);
      if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
      res.status(204).end();
    }
    catch (err) {
      next(err);
    }
  }
}

module.exports = ItemHandler;
