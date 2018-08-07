const config = require('config');
const logger = require('./logger');

// Verify server is configured
if (!config.server) {
  logger.error('Server is not configured - aborting');
  process.exit(1);
}

module.exports = (name) => {
  let options;

  if (config.has(name)) {
    // Get options from config
    options = config.get(name);
  } else {
    // Warn if options not found (defaults must be in config files and not in code)
    logger.warn(`${name} is not configured`);
    options = {};
  }

  // Return options object
  return options;
};
