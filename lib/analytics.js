const config = require('config');
const ua = require('universal-analytics');

const options = config.analytics || {};

module.exports = (visitorId) => {
  if (visitorId)
    return ua(options.ua, visitorId, { strictCidFormat: false });
  else
    return ua(options.ua);
};
