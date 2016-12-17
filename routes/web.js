const express = require('express');
const handlers = require('../handlers/web');
const Boom = require('boom');
const path = require('path');
const router = express.Router();

// Pages
router.get('/', handlers.home);
router.get('/ping', handlers.ping);

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('Page not found'));
});

// Error handler
router.use((err, req, res, next) => {
  const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  if (errPayload.statusCode == 500) logger.error(err.stack);
  res.status(errPayload.statusCode).render('error', {error: errPayload});
});

module.exports = router;
