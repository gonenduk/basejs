/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const Boom = require('@hapi/boom');

function safeParse(name, str) {
  if (!str) return undefined;
  let obj;
  try {
    obj = JSON.parse(str);
  } catch (err) {
    throw Boom.badRequest(`failed to parse ${name}: ${err.message}`);
  }
  if (typeof obj !== 'object') throw Boom.badRequest(`${name} is not an object`);
  return obj;
}

class BaseHandler {
  constructor(model) {
    this.model = model;
  }

  async getOne(req, res) {
    // Get id and filter
    const { id } = req.params;
    const filter = safeParse('filter', req.query.filter);

    // Get item
    const item = await this.model.getOneById(id, filter);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.json(item);
  }

  async deleteOne(req, res) {
    // Get id and filter
    const { id } = req.params;
    const filter = safeParse('filter', req.query.filter);

    // Delete item
    const item = await this.model.deleteOneById(id, filter);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.status(204).end();
  }

  async updateOne(req, res) {
    // Get id and filter
    const { id } = req.params;
    const filter = safeParse('filter', req.query.filter);

    // Update item fields
    const item = await this.model.updateOneById(id, filter, req.body);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.status(204).end();
  }

  async create(req, res) {
    // Set ownership to current user
    const { user } = req;
    if (user.id) req.body.ownerId = user.id;

    // Add one item to collection
    const item = await this.model.addOne(req.body);
    res.status(201).location(`${req.originalUrl}/${item._id}`).json(item);
  }

  async getMany(req, res) {
    // Get filter and sort objects (in OpenAPI 3 won't need to verify they are objects)
    const filter = safeParse('filter', req.query.filter);
    const sort = safeParse('sort', req.query.sort);

    // Get skip and limit
    const { skip, limit } = req.query;

    // Get list of items
    res.json(await this.model.getMany(filter, { sort, skip, limit }));
  }

  async updateMany(req, res) {
    // Get filter object (in OpenAPI 3 won't need to verify they are objects)
    const filter = safeParse('filter', req.query.filter);

    // Update list of items
    await this.model.updateMany(filter, req.body);
    res.status(204).end();
  }

  async deleteMany(req, res) {
    // Get filter object (in OpenAPI 3 won't need to verify it is an object)
    const filter = safeParse('filter', req.query.filter);

    // Delete items from collection
    await this.model.deleteMany(filter);
    res.status(204).end();
  }

  async updateOwner(req, res) {
    // Get id and filter
    const { id } = req.params;
    const filter = safeParse('filter', req.query.filter);

    // Update item owner
    const item = await this.model.replaceOwnerById(id, filter, req.body);
    if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
    res.status(204).end();
  }
}

module.exports = BaseHandler;
