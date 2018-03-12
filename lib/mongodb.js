// Do not load module if no configuration
if (!config.mongodb) return logger.warn('MongoDB module not configured, Skipping');

const mongoose = require('mongoose');
const db = mongoose.connection;

// Use our chosen promise library
const options = config.mongodb;
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

module.exports = db;
