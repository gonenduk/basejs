const express = require('express');
const config = require('config');
const logger = require('../lib/logger');
const swagger = require('swagger-express-middleware');
const sui = require('swagger-ui-dist').getAbsoluteFSPath();
const ua = require('../lib/analytics');
const handlers = require('../handlers');
const Boom = require('boom');
const router = express.Router();

// Default API options
config.api = config.api || {};

// Google analytics
if (config.analytics && config.analytics.api) {
  router.use('/api', (req, res, next) => {
    const visitor = ua(req.user.id);
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ip !== '::1') visitor.set('uip', ip);
    visitor.pageview(req.originalUrl).send();
    next();
  });
}

// Swagger UI
if (config.api.ui) {
  router.get('/api/ui', (req, res, next) => {
    if (!req.query.url) {
      res.redirect('?url=' + req.protocol + '://' + req.get('host') + '/api/docs');
    } else {
      next();
    }
  });
  router.use('/api/ui', express.static(sui));
}

// Swagger middleware
swagger('routes/api.json', router, (err, middleware) => {
  // Halt on errors
  if (err) {
    logger.error(err.message);
    process.exit(1);
  }

  // Parse and validate
  router.use(
    middleware.metadata(),
    middleware.CORS(),
    middleware.files({ useBasePath: true, apiPath: config.api.docs ? '/docs' : '' }),
    middleware.parseRequest(),
    middleware.validateRequest()
  );

  // Handlers
  if (!config.api.mock) {
    router.use('/api', (req, res, next) => {
      // Find handler according to swagger definition
      const handlerName = req.swagger.pathName.slice(1).replace(/\//g, '-');
      const method = req.method.toLowerCase();
      const handler = handlers[handlerName];

      // If handler not found continue to mock and error handling
      if (!handler || !(method in handler)) {
        return next();
      }

      // Call handler
      handler[method](req, res, next);
    })
  }
  // Mock
  else {
    logger.info('Using mock as default handlers');
    router.use(middleware.mock());
  }

  // Default handler (not implemented error)
  router.use('/api', (req, res, next) => {
    next(Boom.notImplemented(`${req.method} /api${req.path} is not implemented`));
  });

  // API is ready
  logger.info('API is ready');
});

module.exports = router;
