const Boom = require('boom');

module.exports = {
  get: (req, res, next) => {
    res.send('Respond with a list of API endpoints');
  },

  // Catch 404 and forward to error handler
  error404: (req, res, next) => {
    next(Boom.notFound('API endpoint not found'));
  },

  // Error handler
  error: (err, req, res, next) => {
    const errPayload = Boom.wrap(err, err.isJoi ? 400 : 500).output.payload;
    if (errPayload.statusCode == 500) {
      logger.error(err.stack);
    }
    res.status(errPayload.statusCode).json(errPayload);
  }
};
