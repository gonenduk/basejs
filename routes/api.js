const express = require('express');
const swaggerize = require('swaggerize-express');
const Boom = require('boom');

const routes = (app) => {
  config.api = config.api || {};

  // CORS support for API
  app.use('/api', (req, res, next) => {
    if (config.api.cors) res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  // Rest API - routes of resources
  app.use(swaggerize({
    api: require('./api.json'),
    docspath: config.api.docs ? 'docs' : '',
    handlers: '../handlers',
    express: {
      'x-powered-by': app.get('x-powered-by'),
      'trust proxy': app.get('trust proxy'),
      'jsonp callback name': app.get('jsonp callback name'),
      'json replacer': app.get('json replacer'),
      'json spaces': app.get('json spaces'),
      'case sensitive routing': app.get('case sensitive routing'),
      'strict routing': app.get('strict routing'),
      'views': app.get('views'),
      'view cache': app.get('view cache'),
      'view engine': app.get('view engine')
    }
  }));

  // Swagger UI
  if (config.api.ui) {
    app.use('/api', express.static('swagger'));
  }

  // Catch 404 and forward to error handler
  app.use('/api', (req, res, next) => {
    next(Boom.notFound('API endpoint not found'));
  });

  // Error handler
  app.use('/api', (err, req, res, next) => {
    const errPayload = Boom.wrap(err, err.status || 500).output.payload;
    if (errPayload.statusCode == 500) logger.error(err.stack);
    res.status(errPayload.statusCode).json(errPayload);
  });
};

module.exports = { routes };
