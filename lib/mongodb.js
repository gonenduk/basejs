const MongoDriver = require('mongodb');
const logger = require('./logger');
const mongoOptions = require('./options')('mongodb');

class MongoConnection {
  constructor(options = {}) {
    this.driver = MongoDriver;
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

    // Take out connection settings from options
    const { url, db } = this.options;
    if (!url || !db) throw Error('MongoDB not connected: configuration is missing');
    delete this.options.url;
    delete this.options.db;

    // Enable new parser for connection string and use unified topology
    this.options.useNewUrlParser = true;
    this.options.useUnifiedTopology = true;

    // Connect to db and report success or failure
    try {
      this.client = new MongoDriver.MongoClient(url, this.options);
      this.connection = await this.client.connect();
      logger.info('MongoDB connected');
      this.db = this.connection.db(db);
    } catch (err) {
      throw Error(`MongoDB failed to connect: ${err.message}`);
    }
  }

  async disconnect() {
    // Ignore if already not connected
    if (this.isConnected) {
      await this.connection.close(false);
      this.connection = undefined;
      this.db = undefined;
      this.client = undefined;
    }
  }
}

module.exports = new MongoConnection();
