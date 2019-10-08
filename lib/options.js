const config = require('config');

module.exports = (name, copy = false) => {
  let options;

  if (config.has(name)) {
    // Copy or send original options from config
    options = copy ? { ...config.get(name) } : config.get(name);
  } else {
    options = {};
  }

  // Return options object
  return options;
};
