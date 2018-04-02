const config = require('config');
const logger = require('./logger');
const mongoose = require('mongoose');
const db = mongoose.connection;

// Default options
const options = config.mongodb || {};

if (options.uri) {
  // Use our chosen promise library (both for mongoose and mongodb)
  mongoose.Promise = Promise;
  options.promiseLibrary = Promise;

  // Take db uri out of options
  const uri = options.uri;
  delete options.uri;

  // Log future connection errors
  db.on('reconnected', () => logger.info('DB reconnected'));
  db.on('disconnected', () => logger.warn('DB disconnected'));

  // Connect to db and log success or failure
  mongoose.connect(uri, options)
    .then(() => logger.info('DB connected'))
    .catch(err => logger.error(`DB failed to connect: ${err.message}`));
} else {
  logger.warn('DB not connected: configuration is missing');
}

module.exports = db;
