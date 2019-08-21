const ua = require('universal-analytics');
const options = require('./options')('analytics');

module.exports = (visitorId) => ((visitorId) ? ua(options.ua, visitorId, { strictCidFormat: false }) : ua(options.ua));
