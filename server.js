#!/usr/bin/env node

// Use strict mode in all project modules
'use strict';
require('auto-strict');

global.Promise = require('bluebird');
const config = require('config');
config.server = config.server || {};

// Cluster support
const cluster = require('./lib/cluster');

// Use cluster - Initialize worker instances
if (cluster.workers) {
  cluster.workers(worker => {
    process.worker = worker;
    require('./worker');
  });

// Don't use cluster - Initialize single server instance in master process
} else {
  require('./worker');
}
