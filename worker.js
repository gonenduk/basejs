const http = require('http');
const logger = require('./lib/logger');
let { port } = require('./lib/options')('server');
require('./lib/logger-http');

// Load app and setup routes
const app = require('./app');

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
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    })

    // Event listener for server "listening" event
    .on('listening', () => {
      const addr = server.address();
      const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
      logger.info(`Listening for http on ${bind}`);
    });
}
