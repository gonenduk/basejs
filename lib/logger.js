/* eslint no-console: "off" */
const config = require('config');
const winston = require('winston');
const rTracer = require('cls-rtracer');

const { transports } = winston;

// Verify logger is configured
if (!config.has('log')) {
  console.log('Logger is not configured - aborting');
  process.exit(1);
}
const options = config.get('log');

// Message format
const { combine, timestamp, printf } = winston.format;

const consoleFormat = printf((info) => {
  const workerId = process.worker && process.worker.id;
  const wid = workerId ? ` (wid: ${process.worker.id})` : '';
  const requestId = rTracer.id();
  const rid = requestId ? ` [rid: ${requestId}]` : '';
  return `${info.level}${wid}${rid}: ${info.message}`;
});

const fileFormat = printf((info) => {
  const workerId = process.worker && process.worker.id;
  const wid = workerId ? ` (wid: ${process.worker.id})` : '';
  const requestId = rTracer.id();
  const rid = requestId ? ` [rid: ${requestId}]` : '';
  return `${info.timestamp} ${info.level}${wid}${rid}: ${info.message}`;
});

// Create logger
const logger = winston.createLogger({ level: options.level });

// Add console output
if (options.console) logger.add(new transports.Console({ format: consoleFormat }));

// Add file output
if (options.file) logger.add(new transports.File({ filename: options.file, format: combine(timestamp(), fileFormat) }));

// Add general stream support
logger.stream.write = (message) => {
  logger.info(message.trim());
};

module.exports = logger;
