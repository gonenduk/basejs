const config = require('config');
const logger = require('./logger');

// Verify server is configured
if (!config.server) {
  logger.error('Server is not configured - aborting');
  process.exit(1);
}

module.exports = (name) => {
  let options = config[name];

  // Warn if options not found (defaults must be in config files and not in code)
  if (!options) {
    logger.warn(`${name} is not configured`);
    options = {};
  }

  // Return options object
  return options;
};
