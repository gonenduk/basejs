const config = require('config');
const logger = require('./logger');
const http = require('http');
const https = require('https');

// Default log options if not configured
const logOptions = config.log || {};

function request(protocol, originalRequest, options, originalCallback) {
  const startTime = process.hrtime();

  return originalRequest.call(protocol, options, (err, res) => {
    const deltaTime = process.hrtime(startTime);
    logger.info(`Network request took ${deltaTime[0]} seconds and ${deltaTime[1]} nanoseconds`);
    if (typeof originalCallback === 'function') originalCallback.apply(null, arguments);
  });
}

// Override request and get functions of http and https
if (logOptions.http) {
  http.request = request.bind(null, http, http.request);
  http.get = request.bind(null, http, http.get);
}

if (logOptions.https) {
  https.request = request.bind(null, https, https.request);
  https.get = request.bind(null, https, https.get);
}
