// Get number of workers
let workers = config.server.workers;
if (workers === 'auto') workers = 0;
workers = parseInt(workers);

// Exit if no workers defined
if (!(workers >= 0)) return;

// Configure express-cluster
const cluster = require('express-cluster');
const options = { count: workers, respawn: true, verbose: true, outputStream: logger.stream };

module.exports = {
	workers: function(cb) {
		cluster(options, cb);
	}
};
