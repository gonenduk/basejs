const express = require('express');
const validation = require('./validations');
const Celebrate = require('celebrate');
const Boom = require('boom');
const router = express.Router();
const config = express.config;

// GET API listing
router.get('/', /*Celebrate(validation.resource-name.get),*/ (req, res, next) => {
  res.send('respond with a resource');
});

/**
 * API error handlers
 */

// Catch 404 and forward to API error handler
router.use((req, res, next) => {
  next(Boom.notFound('API endpoint not found'));
});

// API error handler
router.use((err, req, res, next) => {
  const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  errPayload.stack = config.log.stackTrace ? err.stack : undefined;
  res.status(errPayload.statusCode).json(errPayload);
});

module.exports = router;
