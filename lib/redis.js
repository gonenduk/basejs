const config = require('config');
const logger = require('./logger');
const redis = require('redis');

module.exports = new Promise((resolve, reject) => {
  // Default options
  const options = config.redis || {};


  // Connect to db and log success or failure
  const client = redis.createClient(options);

  client.on('ready', function () {
    logger.info('DB connected');
    resolve(client);
  });

  client.on('error', (err) => {
    const message = `DB failed to connect: ${err.message}`;
    logger.error(message);
    reject(message);
  });
});
