/* eslint import/no-unresolved: "off" */
const redis = require('redis');
const logger = require('./logger');
const options = require('./options')('redis');

const connection = { driver: redis };

Promise.promisifyAll(redis);

const readyPromise = new Promise((resolve, reject) => {
  // Connect to db and log success or failure
  const client = redis.createClient(options);
  connection.client = client;
  connection.db = client;

  client.on('ready', () => {
    logger.info('DB connected');
    resolve(connection);
  });

  client.on('error', (err) => {
    const message = `DB failed to connect: ${err.message}`;
    logger.error(message);
    reject(message);
  });
});

connection.getReady = readyPromise;
module.exports = connection;
