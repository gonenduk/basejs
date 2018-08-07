const MongoDriver = require('mongodb');
const logger = require('./logger');
const options = require('./options')('mongodb', true);

const { MongoClient } = MongoDriver;
const connection = { driver: MongoDriver };

const readyPromise = new Promise((resolve, reject) => {
  // Connection settings
  const { url, db: dbName } = options;

  if (url && dbName) {
    // Use our chosen promise library (both for mongoose and mongodb)
    options.promiseLibrary = Promise;

    // Take db and url out of options
    delete options.url;
    delete options.db;

    // Enable new parser for connection string
    options.useNewUrlParser = true;

    // Connect to db and log success or failure
    MongoClient.connect(url, options).then((client) => {
      logger.info('DB connected');
      connection.client = client;
      connection.db = client.db(dbName);
      resolve(connection);
    }).catch((err) => {
      const message = `DB failed to connect: ${err.message}`;
      logger.error(message);
      reject(message);
    });
  } else {
    const message = 'DB not connected: configuration is missing';
    logger.warn(message);
    reject(message);
  }
});

connection.getReady = readyPromise;
module.exports = connection;
