const Boom = require('@hapi/boom');

class BaseHandler {
  constructor(model) {
    this.model = model;
  }

  async getOne(req, res) {
    // Get id, projection and filter
    const { id } = req.params;
    const { projection, filter } = req.query;

    // Get item
    const item = await this.model.getOneById(id, projection, filter);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.json(item);
  }
}

module.exports = BaseHandler;
