const express = require('express');
const Boom = require('@hapi/boom');
const ac = require('../lib/acl');
const ua = require('../lib/analytics');
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
  if (!permission.granted) throw Boom.forbidden('Access denied');
  return next();
});

// Pages
router.get('/', (req, res) => {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip === '::1') ip = '127.0.0.1';
  res.render('index', { ip });
});

router.get('/ping', (req, res) => {
  res.send('pong');
});

// Catch 404 and forward to error handler
router.use(() => {
  throw Boom.notFound('Page not found');
});

module.exports = router;
