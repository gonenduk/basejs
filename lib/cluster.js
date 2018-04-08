const config = require('config');
const throng = require('throng');
const cpuCount = require('os').cpus().length;

// Get number of workers (auto for cpu count)
let workers = config.server.workers || 0;
if (workers === 'auto') workers = cpuCount;
process.worker = { count: workers };

module.exports = (startMaster, startWorker) => {
  throng({ workers, master: startMaster, start: startWorker });
};
