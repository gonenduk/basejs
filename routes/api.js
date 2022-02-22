const express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const Boom = require('@hapi/boom');
const rTracer = require('cls-rtracer');
const ua = require('../lib/analytics');
const acl = require('../acl');
const handlers = require('../handlers');
const handlersRoutes = require('../handlersRouters');
const options = require('../lib/options');

const apiOptions = options('api');
const analyticsOptions = options('analytics');

const routerAPI = async () => {
  const router = express.Router();

  // Mark API flow
  router.use('/api', (req, res, next) => {
    req.api = true;
    next();
  });

  // Google Analytics
  if (analyticsOptions.api) {
    router.use('/api', (req, res, next) => {
      const visitor = ua(req.user.id);
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (ip !== '::1') visitor.set('uip', ip);
      visitor.pageview(req.originalUrl)
        .send();
      next();
    });
  }

  // Request id
  if (apiOptions.id) {
    router.use('/api', rTracer.expressMiddleware());
  }

  // Swagger validations
  router.use(OpenApiValidator.middleware({ apiSpec: path.join(__dirname, 'api.yaml') }));

  // Access control level validations
  router.use('/api', acl);

  // Handlers
  router.use('/api', handlers);

  // Handlers
  router.use('/api', handlersRoutes);

  // Default handler (not implemented error)
  router.use('/api', (req, res, next) => {
    next(Boom.notImplemented(`${req.method} /api${req.path} not implemented`));
  });

  return router;
};

module.exports = routerAPI();
