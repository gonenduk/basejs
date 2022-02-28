const MongoDriver = require('mongodb');
const logger = require('./logger');
const mongoOptions = require('./options')('mongodb');

class MongoConnection {
  driver = MongoDriver;

  client = MongoDriver.MongoClient;

  constructor(options = {}) {
    this.driver = MongoDriver;
    this.client = MongoDriver.MongoClient;
    this.options = { ...mongoOptions, ...options };
  }

  // eslint-disable-next-line class-methods-use-this
  createNew(options) {
    return new MongoConnection(options);
  }

  get isConnected() {
    return this.connection !== undefined;
  }

  async connect() {
    // Connect only once
    if (this.isConnected) throw Error('MongoDB already connected');

    // Connection settings
    const { url, db: dbName } = this.options;
    if (!url || !dbName) throw Error('MongoDB not connected: configuration is missing');

    return new Promise((resolve, reject) => {
      // Take db and url out of options
      delete this.options.url;
      delete this.options.db;

      // Enable new parser for connection string and use unified topology
      this.options.useNewUrlParser = true;
      this.options.useUnifiedTopology = true;

      // Connect to db and report success or failure
      this.client.connect(url, this.options)
        .then((connection) => {
          logger.info('MongoDB connected');
          this.connection = connection;
          this.db = connection.db(dbName);
          resolve(this);
        })
        .catch((err) => {
          reject(Error(`MongoDB failed to connect: ${err.message}`));
        });
    });
  }

  async disconnect() {
    // Ignore if already not connected
    if (this.isConnected) {
      await this.connection.close(false);
      this.connection = undefined;
      this.db = undefined;
    }
  }
}

module.exports = new MongoConnection();
