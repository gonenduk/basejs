const express = require('express');
const Boom = require('boom');
const router = express.Router();

// CORS support for API
router.use((req, res, next) => {
  if (config.api && config.api.cors) res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Rest API - routes of resources
router.use('/users', require('./api/user'));

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('API endpoint not found'));
});

// Error handler
router.use((err, req, res, next) => {
  const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  if (errPayload.statusCode == 500) logger.error(err.stack);
  res.status(errPayload.statusCode).json(errPayload);
});

module.exports = router;
