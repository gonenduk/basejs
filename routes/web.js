const express = require('express');
const ac = require('../lib/acl');
const ua = require('../lib/analytics');
const handlers = require('../handlers');
const Boom = require('boom');
const options = require('../lib/options');
const router = express.Router();

const analyticsOptions = options('analytics');

// Google analytics (server side)
if (analyticsOptions.web) {
  router.use('/', (req, res, next) => {
    const visitor = ua(req.user.id);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip !== '::1') visitor.set('uip', ip);
    visitor.pageview(req.originalUrl).send();
    next();
  });
}

// Access control
router.use('/', (req, res, next) => {
  // Access control
  const permission = ac.can(req.user.role).readAny('webpage');
  if (!permission.granted)
    return next(Boom.forbidden(`Access denied`));
  next();
});

// Pages
router.get('/', handlers.web.home);
router.get('/ping', handlers.web.ping);

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('Page not found'));
});

module.exports = router;
