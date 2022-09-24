const Boom = require('@hapi/boom');
const logger = require('../lib/logger');

// noinspection JSUnusedLocalSymbols
module.exports = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  // Convert error to Boom error and set status to 500 if not set
  const { payload, headers } = Boom.boomify(err, { statusCode: err.status, override: false }).output;

  // Log stack on server internal error
  if (payload.statusCode === 500) logger.error(err.stack);

  // Respond with correct content type
  res.set(headers);
  if (req.path.startsWith('/api')) {
    res.status(payload.statusCode).json(payload);
  } else {
    res.status(payload.statusCode).render('error', { error: payload });
  }
};
