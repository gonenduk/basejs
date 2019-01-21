const MongoDriver = require('mongodb');
const logger = require('./logger');
const mongoOptions = require('./options')('mongodb');

class MongoConnection {
  constructor(options = {}) {
    this.driver = MongoDriver;
    this.client = MongoDriver.MongoClient;
    this.options = Object.assign({}, mongoOptions, options);
  }

  static createNew(options) {
    return new MongoConnection(options);
  }

  get isConnected() {
    return this.connection !== undefined;
  }

  connect() {
    return new Promise((resolve, reject) => {
      // Connect only once
      if (!this.isConnected) {
        // Connection settings
        const { url, db: dbName } = this.options;

        if (url && dbName) {
          // Use our chosen promise library (both for mongoose and mongodb)
          this.options.promiseLibrary = Promise;

          // Take db and url out of options
          delete this.options.url;
          delete this.options.db;

          // Enable new parser for connection string
          this.options.useNewUrlParser = true;

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
        } else {
          reject(Error('MongoDB not connected: configuration is missing'));
        }
      } else {
        reject(Error('MongoDB already connected'));
      }
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
