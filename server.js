#!/usr/bin/env node

// Use strict mode in all project modules
require('auto-strict');

// Initialize promise library, config, logger and cluster
global.Promise = require('bluebird');
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
cluster(startMaster, startWorker, startNoCluster);
