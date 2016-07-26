const express = require('express');
const config = require('config');
const validation = require('./validations');
const Celebrate = require('celebrate');
const Boom = require('boom');
const router = express.Router();

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
  Boom.wrap(err, err.isJoi ? 400 : 500);
  err.stack = config.log.stackTrace ? err.stack : '';
  res.status(err.output.statusCode).json(err);
});

module.exports = router;
