/* eslint no-unused-vars: "off" */
const Boom = require('@hapi/boom');
const logger = require('../lib/logger');

module.exports = (err, req, res, next) => {
  // Convert error to Boom error and set status to 500 if not set
  const { payload, headers } = Boom.boomify(err, { statusCode: err.status, override: false }).output;

  // Log stack on server errors
  if (err.isServer) logger.error(err.stack);

  // Respond with correct content type
  res.set(headers);
  if (req.url.split('/')[1].toLowerCase() === 'api') {
    res.status(payload.statusCode).json(payload);
  } else {
    res.status(payload.statusCode).render('error', { error: payload });
  }
};
