const logger = require('./logger');
const http = require('http');
const https = require('https');
const logOptions = require('./options')('log');

const NS_PER_SEC = 1e9;
const MS_PER_NS = 1e6;

function getHrDeltaInMs(startTime, endTime) {
  // Convert to nanoseconds
  const start = startTime[0] * NS_PER_SEC + startTime[1];
  const end = endTime[0] * NS_PER_SEC + endTime[1];

  // Return delta in milliseconds
  return (end - start) / MS_PER_NS;
}

function request(protocol, originalRequest, options, originalCallback) {
  const timings = {
    startAt: process.hrtime(),
    dnsLookupAt: undefined,
    tcpConnectionAt: undefined,
    tlsHandshakeAt: undefined,
    firstByteAt: undefined,
    endAt: undefined
  };

  const req = originalRequest.call(protocol, options, (res) => {
    res.once('readable', () => {
      timings.firstByteAt = process.hrtime();
      res.on('data', () => { }); // Fix for Node 10 bug
    });
    res.on('end', () => {
      timings.endAt = process.hrtime();
      const deltaTimings = {
        method: options.method,
        host: options.host,
        port: options.port,
        path: options.path,
        // There is no DNS lookup with IP address
        dnsLookup: timings.dnsLookupAt ? getHrDeltaInMs(timings.startAt, timings.dnsLookupAt) : undefined,
        tcpConnection: getHrDeltaInMs(timings.dnsLookupAt || timings.startAt, timings.tcpConnectionAt),
        // There is no TLS handshake without https
        tlsHandshake: timings.tlsHandshakeAt ? (getHrDeltaInMs(timings.tcpConnectionAt, timings.tlsHandshakeAt)) : undefined,
        firstByte: getHrDeltaInMs((timings.tlsHandshakeAt || timings.tcpConnectionAt), timings.firstByteAt),
        contentTransfer: getHrDeltaInMs(timings.firstByteAt, timings.endAt),
        total: getHrDeltaInMs(timings.startAt, timings.endAt)
      };
      logger.info(`HTTP request: ${JSON.stringify(deltaTimings)}`);
    });

    if (typeof originalCallback === 'function') originalCallback(res);
  });

  req.on('socket', (socket) => {
    socket.on('lookup', () => {
      timings.dnsLookupAt = process.hrtime()
    });
    socket.on('connect', () => {
      timings.tcpConnectionAt = process.hrtime()
    });
    socket.on('secureConnect', () => {
      timings.tlsHandshakeAt = process.hrtime()
    });
  });

  return req;
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
