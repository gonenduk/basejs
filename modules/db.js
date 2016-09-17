// Do not load module if no configuration
if (!config.mongodb) return;

const mongoose = require('mongoose');

// Use our chosen promise library
const options = config.mongodb;
mongoose.Promise = Promise;
options.promiseLibrary = Promise;

// Log connection errors
mongoose.connection.on('reconnected', () => logger.info('DB reconnected'));
mongoose.connection.on('disconnected', () => logger.warn('DB disconnected'));
mongoose.connection.on('error', err => logger.error(`DB error: ${err.message}`));

// Connect to db and log success or failure
mongoose.connect(options.uri, options)
  .then(() => logger.info('DB connected'))
  .catch(err => logger.error(`DB error: ${err.message}`));

module.exports = mongoose;
