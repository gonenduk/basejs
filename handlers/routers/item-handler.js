const express = require('express');
const Boom = require('@hapi/boom');
const safe = require('./safe');

module.exports = (model) => {
  const router = express.Router();

  router.route('/:id')
    .get(safe(async (req, res) => {
      // Get id, projection and filter
      const { id } = req.params;
      const { projection, filter } = req.query;

      // Get item
      const item = await model.getOneById(id, projection, filter);
      if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
      res.json(item);
    }))

    .delete(safe(async (req, res) => {
      // Get id and filter
      const { id } = req.params;
      const { filter } = req.query;

      // Delete item
      const item = await model.deleteOneById(id, filter);
      if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
      res.status(204).end();
    }))

    .patch(safe(async (req, res) => {
      // Get id and filter
      const { id } = req.params;
      const { filter } = req.query;

      // Update item fields
      const item = await model.updateOneById(id, req.body, filter);
      if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
      res.status(204).end();
    }));

  return router;
};
