const express = require('express');
const validation = require('./validations');
const Celebrate = require('celebrate');
const Boom = require('boom');
const error2json = require('../modules/error2json');
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
  const jsonError = error2json(err);
  res.status(jsonError.code).json(jsonError);
});

module.exports = router;
