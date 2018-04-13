const express = require('express');
const config = require('config');
const ua = require('../lib/analytics');
const handlers = require('../handlers');
const Boom = require('boom');
const router = express.Router();

// Google analytics (server side)
if (config.analytics && config.analytics.web) {
  router.use('/', (req, res, next) => {
    const visitor = ua(req.user.id);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip !== '::1') visitor.set('uip', ip);
    visitor.pageview(req.originalUrl).send();
    next();
  });
}

// Pages
router.get('/', handlers.web.home);
router.get('/ping', handlers.web.ping);

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('Page not found'));
});

module.exports = router;
