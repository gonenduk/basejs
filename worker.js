/* eslint global-require: "off" */
const http = require('http');
const logger = require('./lib/logger');
let { port } = require('./lib/options')('server');
require('./lib/logger-http');
const initServices = require('./lib/init');

async function initApp() {
  const app = require('./app');
  await app.locals.isReady;
  return app;
}

function listen(app) {
  // Normalize a port into a number, string, or false
  function normalizePort(val) {
    const portNumber = parseInt(val, 10);

    if (Number.isNaN(portNumber)) {
      // named pipe
      return val;
    }

    if (portNumber > 0) {
      // port number
      return portNumber;
    }

    // invalid port
    return 0;
  }

  // Get port from configuration, throw if not given
  port = normalizePort(port);
  return new Promise((resolve, reject) => {
    if (!port) throw Error('Invalid port');

    // Create server
    const server = http.createServer(app)

      // Listen to port
      .listen(port)

      // Event listener for server "error" event
      .on('error', (error) => {
        const bind = typeof port === 'string'
          ? `Pipe ${port}`
          : `Port ${port}`;

        // handle specific listen errors with friendly messages
        switch (error.code) {
          case 'EACCES':
            return reject(Error(`${bind} requires elevated privileges`));
          case 'EADDRINUSE':
            return reject(Error(`${bind} is already in use`));
          default:
            return reject(error);
        }
      })

      // Event listener for server "listening" event
      .on('listening', () => {
        const addr = server.address();
        const bind = typeof addr === 'string'
          ? `pipe ${addr}`
          : `port ${addr.port}`;
        logger.info(`Listening for http on ${bind}`);
        resolve();
      });
  });
}

// Init app, exit on failure
initServices()
  .then(initApp)
  .then(listen)
  .catch((err) => {
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  });
