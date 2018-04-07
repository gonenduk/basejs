const express = require('express');
const config = require('config');
const logger = require('../lib/logger');
const swagger = require('swagger-express-middleware');
const sui = require('swagger-ui-dist').getAbsoluteFSPath();
const handlers = require('../handlers');
const roles = require('../lib/roles');
const Boom = require('boom');
const router = express.Router();

// Default API options
config.api = config.api || {};

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

  // Authorization
  router.use('/api', (req, res, next) => {
    // Verify user role is valid
    if (!roles.exists(req.user.role)) {
      return next(Boom.unauthorized(`Invalid user role: '${req.user.role}'`));
    }

    // Roles
    const swagger = req.swagger;
    let role = swagger.operation['x-security-role'];
    if (role === undefined) role = swagger.path['x-security-role'];
    if (role === undefined) role = swagger.api['x-security-role'];
    if (role === '') role = undefined;
    if (role) {
      // Verify required role is valid
      if (!roles.exists(role)) {
        return next(Boom.unauthorized(`${req.method} /api${req.path} invalid required user role: '${role}'`));
      }

      // Validate user role with required role
      if (!roles.validate(req.user.role, role)) {
        return next(Boom.forbidden('Access denied'));
      }
    }

    next();
  });

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
  // Mock
  } else {
    logger.info('Using mock as default handlers');
    router.use(middleware.mock());
  }

  // Default handler (not implemented error)
  router.use('/api', (req, res, next) => {
    next(Boom.notImplemented(`${req.method} /api${req.path} is not implemented`));
  });

  // Error handler for API
  router.use((err, req, res, next) => {
    const errPayload = handlers.error.payload(err);
    res.status(errPayload.statusCode).json(errPayload);
  });

  // API is ready
  logger.info('API is ready');
});

module.exports = router;
