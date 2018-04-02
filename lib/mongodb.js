const config = require('config');
const logger = require('./logger');
const MongoClient = require('mongodb').MongoClient;
let db = undefined;

// Default options
const options = config.mongodb || {};
const url = options.url;
const dbName = options.db;

if (url && dbName) {
  // Use our chosen promise library (both for mongoose and mongodb)
  options.promiseLibrary = Promise;

  // Take db and url out of options
  delete options.url;
  delete options.db;

  // Connect to db and log success or failure
  MongoClient.connect(url, options).then(client => {
    db = client.db(dbName);
    logger.info('DB connected');
  }).catch(err => {
    logger.error(`DB failed to connect: ${err.message}`);
  });
} else {
  logger.warn('DB not connected: configuration is missing');
}

module.exports = db;
