const express = require('express');
const Boom = require('boom');
const router = express.Router();

// Rest API - routes of resources
router.use('/users', require('./api/user'));

// API root - redirect to swagger UI
router.get('/', (req, res, next) => {
  res.send('Respond with a list of API endpoints');
});

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('API endpoint not found'));
});

// Error handler
router.use((err, req, res, next) => {
  const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  if (errPayload.statusCode == 500) {
    logger.error(err.stack);
  }
  res.status(errPayload.statusCode).json(errPayload);
});

module.exports = router;
