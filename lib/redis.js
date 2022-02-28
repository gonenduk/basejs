/* eslint import/no-unresolved: "off" */
const RedisDriver = require('ioredis');
const logger = require('./logger');
const redisOptions = require('./options')('redis');

class RedisConnection {
  constructor(options = {}) {
    this.driver = RedisDriver;
    this.options = { ...redisOptions, ...options };
  }

  // eslint-disable-next-line class-methods-use-this
  createNew(options) {
    return new RedisConnection(options);
  }

  get isConnected() {
    return this.connection !== undefined;
  }

  async connect() {
    // Connect only once
    if (this.isConnected) throw Error('Redis already connected');

    return new Promise((resolve, reject) => {
      // Connect to db and report success or failure
      this.client = new RedisDriver(this.options);
      this.client.once('ready', () => {
        logger.info('Redis connected');
        this.connection = this.client;
        this.db = this.client;
        resolve();
      });
      this.client.on('error', (err) => {
        reject(Error(`Redis failed to connect: ${err.message}`));
      });
    });
  }

  async disconnect() {
    // Ignore if already not connected
    if (this.isConnected) {
      await this.connection.disconnect();
      this.client = undefined;
      this.connection = undefined;
      this.db = undefined;
    }
  }
}

module.exports = new RedisConnection();
