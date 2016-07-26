const express = require('express');
const Boom = require('boom');
const error2json = require('../modules/error2json');
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
  const jsonError = error2json(err);
  res.status(jsonError.code).render('error', {error: jsonError});
});

module.exports = router;
