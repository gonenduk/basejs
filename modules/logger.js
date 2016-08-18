const winston = require('winston');
const logger = new (winston.Logger)();

// Add console output
if (config.log.console) {
  logger.add(winston.transports.Console, {
    level: config.log.level
  });
}

// Add file output
if (config.log.file) {
  logger.add(winston.transports.File, {
    level: config.log.level,
    filename: config.log.file,
    timestamp: true
  });
}

// Add worker id to log messages
logger.filters.push((level, msg, meta) => {
  return process.worker ? `(${process.worker.id}) ${msg}` : msg;
});

module.exports = logger;