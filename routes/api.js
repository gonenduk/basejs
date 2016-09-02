const express = require('express');
const Celebrate = require('celebrate');
const validations = require('./validations');
const Boom = require('boom');
const router = express.Router();

// API root
router.get('/', (req, res, next) => {
  res.send('Respond with a list of API endpoints');
});

// User
router.get('/users/:id', Celebrate(validations.user.get), (req, res, next) => {
  next(Boom.notFound('User not found'));
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
  if (errPayload.statusCode == 500) {
    logger.error(err.stack);
  }
  res.status(errPayload.statusCode).json(errPayload);
});

module.exports = router;
