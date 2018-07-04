const config = require('config');
const logger = require('./logger');

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
