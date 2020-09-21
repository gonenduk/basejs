const throng = require('throng');
const cpuCount = require('os').cpus().length;
const options = require('./options')('server');

// Get number of workers (auto for cpu count)
let { workers } = options;
if (workers === 'auto') workers = cpuCount;
workers = Number(workers);
process.worker = { count: workers };

module.exports = async (startMaster, startWorker, startNoCluster) => {
  if (workers > 0) return throng({ master: startMaster, worker: startWorker, count: workers });
  return startNoCluster();
};
