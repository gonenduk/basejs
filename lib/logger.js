const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const options = require('./options')('log');

// Message format
const consoleFormat = printf(info => {
  const workerId = process.worker && process.worker.id ? ` (${process.worker.id})` : '';
  return `${info.level}${workerId}: ${info.message}`;
});

const fileFormat = printf(info => {
  const workerId = process.worker && process.worker.id ? ` (${process.worker.id})` : '';
  return `${info.timestamp} ${info.level}${workerId}: ${info.message}`;
});

// Create logger
const logger = createLogger({ level: options.level });

// Add console output
if (options.console) logger.add(new transports.Console({ format: consoleFormat }));

// Add file output
if (options.file) logger.add(new transports.File({ filename: options.file, format: combine(timestamp(), fileFormat) }));

// Add general stream support
logger.stream = {
  write: (message, encoding) => {
    logger.info(message.trim());
  }
};

module.exports = logger;
