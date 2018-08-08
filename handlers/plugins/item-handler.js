const Boom = require('boom');

class ItemHandler {
  constructor(model) {
    this.model = model;
  }

  async get(req, res, next) {
    // Get id, projection and filter
    const { id } = req.pathParams;
    const { projection, filter } = req.query;

    // Get item
    const item = await this.model.getOneById(id, projection, filter);
    if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
    return res.json(item);
  }

  async delete(req, res, next) {
    // Get id and filter
    const { id } = req.pathParams;
    const { filter } = req.query;

    // Delete item
    const item = await this.model.deleteOneById(id, filter);
    if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
    return res.status(204).end();
  }

  async patch(req, res, next) {
    // Get id and filter
    const { id } = req.pathParams;
    const { filter } = req.query;

    // Update item fields
    const item = await this.model.updateOneById(id, req.body, filter);
    if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
    return res.status(204).end();
  }
}

module.exports = ItemHandler;
