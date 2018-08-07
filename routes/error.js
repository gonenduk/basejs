const Boom = require('boom');
const logger = require('../lib/logger');

/* eslint no-unused-vars: "off" */
module.exports = (err, req, res, next) => {
  // Convert error to Boom error and set status to 500 if not set
  const errPayload = Boom.boomify(err, { statusCode: err.status || 500, override: false }).output.payload;

  // Log stack on server errors
  if (errPayload.statusCode === 500) logger.error(err.stack);

  // Respond with correct content type
  if (req.url.split('/')[1].toLowerCase() === 'api') {
    res.status(errPayload.statusCode).json(errPayload);
  } else {
    res.status(errPayload.statusCode).render('error', { error: errPayload });
  }
};
