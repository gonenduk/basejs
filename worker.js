const config = require('config');
const logger = require('./lib/logger');

// Load app and setup routes
const app = require('./app');

// Create network listeners for each protocol
const ports = config.server.ports || {};
for (let protocol in ports) {
  listen(protocol, app);
}

function listen(protocol, requestListener, options) {
    // Get port from configuration, ignore if not given
    const port = normalizePort(config.server.ports[protocol]);
    if (!port) return;

    // Create network server
    const network = require(protocol);
    const server = options ? network.createServer(options, requestListener) : network.createServer(requestListener);

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

    // Event listener for server "error" event
    function onError(error) {
        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

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
    }

    // Event listener for server "listening" event
    function onListening() {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        logger.info(`Listening for ${protocol} on ${bind}`);
    }
}
