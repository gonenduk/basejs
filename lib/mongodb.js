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

  // Log connection errors
  db.on('reconnected', () => logger.info('DB reconnected'));
  db.on('disconnected', () => logger.warn('DB disconnected'));
  db.on('error', err => logger.error(`DB error: ${err.message}`));

  // Connect to db and log success or failure
  mongoose.connect(uri, options)
    .then(() => logger.info('DB connected'))
    .catch(() => {
      logger.info('exiting...');
      process.exit(1);
    });
} else {
  logger.warn('DB not connected: configuration is missing')
}

module.exports = db;
