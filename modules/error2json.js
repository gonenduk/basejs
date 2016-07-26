const config = require('config');
const Boom = require('boom');

module.exports = err => {
  Boom.wrap(err, err.isJoi ? 400 : 500);

  return {
    code: err.output.payload.statusCode,
    name: err.output.payload.error,
    message: err.output.payload.message,
    data: err.data ? err.data : undefined,
    stack: config.log.stackTrace ? err.stack : undefined
  }
};
