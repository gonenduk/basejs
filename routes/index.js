const express = require('express');
const Boom = require('boom');
const router = express.Router();
const config = express.config;

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
  const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  errPayload.stack = config.log.stackTrace ? err.stack : undefined;
  res.status(errPayload.statusCode).render('error', {error: errPayload});
});

module.exports = router;
