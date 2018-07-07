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
cluster(startMaster, startWorker, startNoCluster);

function startMaster() {
  logger.info(`Master Started on pid ${process.pid}, forking ${process.worker.count} processes`);
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

function startNoCluster() {
  require('./worker');
}
