#!/usr/bin/env node

// Use strict mode in all project modules
'use strict';
require('auto-strict');

// Initialize promise library, config and logger
global.Promise = require('bluebird');
const config = require('config');
config.server = config.server || {};
const logger = require('./lib/logger');

// Cluster support
const cluster = require('./lib/cluster');
cluster(startMaster, startWorker);

function startMaster() {
  // Run as master only if workers configured
  if (process.worker.count >= 1)
    logger.info(`Master Started on pid ${process.pid}`);
  else
    require('./worker');
}

function startWorker(id) {
  process.worker.id = id;
  logger.info(`Worker started`);

  process.on('SIGTERM', () => {
    logger.info(`Worker exiting...`);
    process.exit();
  });

  require('./worker');
}
