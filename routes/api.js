const express = require('express');
const Boom = require('boom');
const swaggerJSDoc = require('swagger-jsdoc');
const router = express.Router();

// Rest API - routes of resources
router.use('/users', require('./api/user'));

// Swagger JSDoc
const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: {
    info: {
      title: 'basejs API',
      version: '1.0.0',
    },
  },
  apis: ['./routes/api/user.js'], // Path to the API docs
});

// GET swagger json file
router.get('/api-docs.json', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Catch 404 and forward to error handler
router.use((req, res, next) => {
  next(Boom.notFound('API endpoint not found'));
});

// Error handler
router.use((err, req, res, next) => {
  const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
  if (errPayload.statusCode == 500) {
    logger.error(err.stack);
  }
  res.status(errPayload.statusCode).json(errPayload);
});

module.exports = router;
