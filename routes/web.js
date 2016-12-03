const express = require('express');
const controllers = require('../controllers/web');
const Boom = require('boom');
const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');
const router = express.Router();

// Pages
router.get('/', controllers.home);
router.get('/ping', controllers.ping);

// Swagger
if (config.swagger) {
  if (config.swagger.json) {
    // Swagger JSDoc
    const swaggerSpec = swaggerJSDoc({
      swaggerDefinition: {
        info: {
          title: 'basejs API',
          version: '0.0.1',
          description: 'Documentation of the RESTful API exposed by basejs',
        },
        basePath: '/api'
      },
      apis: ['./routes/api/user.js'], // Path to the API docs
    });

    // Swagger definition file (CORS enabled)
    router.get('/api-docs.json', (req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.json(swaggerSpec);
    });
  }

  // Swagger UI
  if (config.swagger.ui) router.use(express.static(path.join(__dirname, '../swagger')));
}

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('Page not found'));
});

// Error handler
router.use((err, req, res, next) => {
  const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  if (errPayload.statusCode == 500) logger.error(err.stack);
  res.status(errPayload.statusCode).render('error', {error: errPayload});
});

module.exports = router;
