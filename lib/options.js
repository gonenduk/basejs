const config = require('config');
const logger = require('./logger');

module.exports = (name, copy = false) => {
  let options;

  if (config.has(name)) {
    // Copy or send original options from config
    options = copy ? { ...config.get(name) } : config.get(name);
  } else {
    // Warn if options not found (defaults must be in config files and not in code)
    logger.warn(`${name} is not configured`);
    options = {};
  }

  // Return options object
  return options;
};
