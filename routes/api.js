const express = require('express');
const validations = require('./validations');
const controllers = require('../controllers');
const Celebrate = require('celebrate');
const Boom = require('boom');
const router = express.Router();

// User
router.get('/users/:userId', Celebrate(validations.user.get), controllers.user.get);

// Replace userId set to 'me' with logged in user id
router.param('userId', (req, res, next, userId) => {
  if (userId == 'me') {
    if (!req.user || !req.user.id) {
      return next(Boom.unauthorized('Not logged in'));
    }
    req.params.userId = req.user.id;
  }
  next();
});

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
