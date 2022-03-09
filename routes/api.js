const express = require('express');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');
const Boom = require('@hapi/boom');
const rTracer = require('cls-rtracer');
const ua = require('../lib/analytics');
const acl = require('../acl');
const handlers = require('../handlers');
const options = require('../lib/options');

const apiOptions = options('api');
const analyticsOptions = options('analytics');

const routerAPI = async () => {
  const router = express.Router();

  // Google Analytics
  if (analyticsOptions.api) {
    router.use('/api', (req, res, next) => {
      const visitor = ua(req.user.id);
      const ip = req.clientIp;
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
  router.use(OpenApiValidator.middleware({
    apiSpec: path.join(__dirname, 'api.yaml'),
    operationHandlers: {
      basePath: path.join(__dirname, '../handlers'),
      resolver: (basePath, route, apiDoc) => {
        const pathKey = route.openApiRoute.substring(route.basePath.length);
        const schema = apiDoc.paths[pathKey][route.method.toLowerCase()];

        // Get operation handler and id
        const { operationId } = schema;
        const operationHandler = schema['x-eov-operation-handler'];

        // Handler and access control level validations
        const operation = handlers?.[operationHandler]?.[operationId];
        if (operation) {
          return async (req, res, next) => {
            try {
              acl?.[operationHandler]?.[operationId]?.(req);
              await operation(req, res);
            } catch (err) {
              next(err);
            }
          };
        }

        // Default handler (not implemented error)
        return (req, res, next) => {
          next(Boom.notImplemented(`${req.method} ${req.path} not implemented`));
        };
      },
    },
  }));

  return router;
};

module.exports = routerAPI();
