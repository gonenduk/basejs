const winston = require('winston');
const config = require('config');
const logger = new (winston.Logger)();

// Default log options if not configured
const options = config.log || {};

// Add console output
if (options.console) {
  logger.add(winston.transports.Console, {
    level: options.level
  });
}

// Add file output
if (options.file) {
  logger.add(winston.transports.File, {
    level: options.level,
    filename: options.file,
    timestamp: true
  });
}

// Add worker id to log messages
logger.filters.push((level, msg, meta) => {
  return process.worker && process.worker.id ? `(${process.worker.id}) ${msg}` : msg;
});

// Add general stream support
logger.stream = {
  write: (message, encoding) => {
    logger.info(message.trim());
  }
};

module.exports = logger;
