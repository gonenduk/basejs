/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
const express = require('express');
const Boom = require('@hapi/boom');
const safe = require('./safe');

function safeParse(name, str) {
  let obj;
  try {
    obj = JSON.parse(str);
  } catch (err) {
    throw Boom.badRequest(`failed to parse ${name}: ${err.message}`);
  }
  if (typeof obj !== 'object') throw Boom.badRequest(`${name} is not an object`);
  return obj;
}

module.exports = (model) => {
  const router = express.Router();

  router.route('/')
    .get(safe(async (req, res) => {
      // Get filter and sort objects (in OpenAPI 3 won't need to verify they are objects)
      let filter;
      let sort;
      if (req.query.filter) filter = safeParse('filter', req.query.filter);
      if (req.query.sort) sort = safeParse('sort', req.query.sort);

      // Get skip and limit
      const { skip, limit, projection } = req.query;

      // Get list of items
      res.json(await model.getMany(filter, {
        sort, skip, limit, projection,
      }));
    }))

    .post(safe(async (req, res) => {
      // Add one item to collection
      const item = await model.addOne(req.body);
      res.status(201).location(`${req.originalUrl}/${item._id}`).json(item);
    }))

    .patch(safe(async (req, res) => {
      // Get filter object (in OpenAPI 3 won't need to verify they are objects)
      let filter;
      if (req.query.filter) filter = safeParse('filter', req.query.filter);

      // Update list of items
      await model.updateMany(filter, req.body);
      res.status(204).end();
    }))

    .delete(safe(async (req, res) => {
      // Get filter object (in OpenAPI 3 won't need to verify it is an object)
      let filter;
      if (req.query.filter) filter = safeParse('filter', req.query.filter);

      // Delete items from collection
      await model.deleteMany(filter);
      res.status(204).end();
    }));

  return router;
};
