const express = require('express');
const config = require('config');
const Boom = require('boom');
const router = express.Router();

// GET home page
router.get('/', (req, res, next) => {
  res.render('index');
});

// GET ping
router.get('/ping', (req, res, next) => {
  res.send('pong');
});

/**
 * Pages error handlers
 */

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('Page not found'));
});

// Error handler
router.use((err, req, res, next) => {
  Boom.wrap(err, err.isJoi ? 400 : 500);
  err.stack = config.log.stackTrace ? err.stack : '';
  res.status(err.output.statusCode).render('error', {error: err});
});

module.exports = router;
