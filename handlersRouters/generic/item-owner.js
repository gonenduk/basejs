const express = require('express');
const Boom = require('@hapi/boom');

module.exports = (model) => {
  const router = express.Router();

  router.route('/:id/owner')
    .put(async (req, res) => {
      // Get id and filter
      const { id } = req.params;
      const { filter } = req.query;

      // Update item owner
      const item = await model.replaceOwnerById(id, req.body, filter);
      if (!item) throw Boom.notFound(`${req.originalUrl} not found`);
      res.status(204).end();
    });
};
