/* eslint global-require: "off" */
const http = require('http');
const logger = require('./lib/logger');
let { port } = require('./lib/options')('server');
require('./lib/logger-http');
const initServices = require('./lib/init');

function initApp() {
  return new Promise((resolve, reject) => {
    // Load app and setup routes
    const app = require('./app');
    app.once('routes:ready', () => {
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

      // Get port from configuration, ignore if not given
      port = normalizePort(port);
      if (port) {
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
                reject(Error(`${bind} requires elevated privileges`));
                break;
              case 'EADDRINUSE':
                reject(Error(`${bind} is already in use`));
                break;
              default:
                reject(error);
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
      }
    });
  });
}

// Init app, exit on failure
initServices()
  .then(initApp)
  .catch((err) => {
    logger.error(`Failed to start: ${err.message}`);
    process.exit(1);
  });
