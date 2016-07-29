module.exports = (config, worker) => {

  // Store configuration and worker in express
  const express = require('express');
  express.config = config;
  express.worker = worker;

  // Load app and http server
  const app = require('../app');
  const http = require('http');

  // Get port from configuration or environment and store in express
  const port = normalizePort(process.env.PORT || config.server.port || '3000');
  app.set('port', port);

  // Create HTTP server
  const server = http.createServer(app);

  // Listen on provided port, on all network interfaces
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  // Normalize a port into a number, string, or false
  function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  // Event listener for HTTP server "error" event
  function onError(error) {
    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;
    const id = worker ? `(${worker.id}) ` : '';

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${id}${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${id}${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  // Event listener for HTTP server "listening" event
  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    const id = worker ? `(${worker.id}) ` : '';
    console.log(`${id}Listening on ${bind}`);
  }
};
