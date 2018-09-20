const Boom = require('boom');

class ItemHandler {
  constructor(model) {
    this.model = model;
  }

  async put(req, res, next) {
    // Get id and filter
    const { id } = req.pathParams;
    const { filter } = req.query;

    // Update item fields
    const item = await this.model.replaceOwnerById(id, req.body, filter);
    if (!item) return next(Boom.notFound(`${req.originalUrl} not found`));
    return res.status(204).end();
  }
}

module.exports = ItemHandler;
