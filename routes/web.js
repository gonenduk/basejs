const express = require('express');
const handlers = require('../handlers');
const Boom = require('boom');
const router = express.Router();

// Pages
router.get('/', handlers.web.home);
router.get('/ping', handlers.web.ping);

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('Page not found'));
});

// Error handler for web pages
router.use((err, req, res, next) => {
  const errPayload = handlers.error.payload(err);
  res.status(errPayload.statusCode).render('error', { error: errPayload });
});

module.exports = router;
