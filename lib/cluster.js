const throng = require('throng');
const cpuCount = require('os').cpus().length;
const options = require('./options')('server');

// Get number of workers (auto for cpu count)
let workers = options.workers;
if (workers === 'auto') workers = cpuCount;
process.worker = { count: workers };

module.exports = (startMaster, startWorker, startNoCluster) => {
  if (workers > 0)
    throng({ workers, master: startMaster, start: startWorker });
  else
    startNoCluster();
};
