const express = require('express');
const path = require('path');
const { OpenApiValidator } = require('express-openapi-validator');
const sui = require('swagger-ui-dist').getAbsoluteFSPath();
const Boom = require('@hapi/boom');
const rTracer = require('cls-rtracer');
const ua = require('../lib/analytics');
const acl = require('../acl');
const handlers = require('../handlers');
const handlersRoutes = require('../handlersRouters');
const build = require('./build');
const options = require('../lib/options');

const apiOptions = options('api');
const analyticsOptions = options('analytics');

const routerAPI = async () => {
  const router = express.Router();

  // Google analytics
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

  // Swagger UI
  if (apiOptions.ui) {
    router.get('/api/ui', (req, res, next) => {
      if (!req.query.url) {
        res.redirect('?url=/api/docs');
      } else {
        next();
      }
    });
    router.use('/api/ui', express.static(sui));
  }

  // Swagger docs
  if (apiOptions.docs) {
    router.use('/api/docs', express.static(path.join(__dirname, 'api.yaml')));
  }

  // Request id
  if (apiOptions.id) {
    router.use('/api', rTracer.expressMiddleware());
  }

  // Swagger validations
  await new OpenApiValidator({ apiSpec: path.join(__dirname, 'api.yaml') }).install(router);

  // Access control level validations
  build(router, '/api', acl);

  // Handlers
  build(router, '/api', handlers);

  // Handlers
  router.use('/api', handlersRoutes);

  // Default handler (not implemented error)
  router.use('/api', (req, res, next) => {
    next(Boom.notImplemented(`${req.method} /api${req.path} not implemented`));
  });

  return router;
};

module.exports = routerAPI();
