#!/usr/bin/env node
/* eslint global-require: "off" */

// Use strict mode in all project modules
require('auto-strict');

// Initialize config, logger and cluster
const logger = require('./lib/logger');
const cluster = require('./lib/cluster');

// Cluster callback functions
function startMaster() {
  logger.info(`Master started on pid ${process.pid}, forking ${process.worker.count} processes`);
}

function startWorker(id) {
  process.worker.id = id;
  logger.info('Worker started');

  process.on('SIGTERM', () => {
    logger.info('Worker exiting...');
    process.exit();
  });

  require('./worker');
}

function startNoCluster() {
  require('./worker');
}

// Start cluster support
cluster(startMaster, startWorker, startNoCluster).catch((err) => {
  logger.error(`Failed to start: ${err.message}`);
});
