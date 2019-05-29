const express = require('express');
const Boom = require('boom');
const safe = require('./safe');

module.exports = (model) => {
  const router = express.Router();

  router.route('/:id/owner')
    .put(safe(async (req, res) => {
      // Get id and filter
      const { id } = req.pathParams;
      const { filter } = req.query;

      // Update item owner
      const item = await model.replaceOwnerById(id, req.body, filter);
      if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
      res.status(204).end();
    }));
};
