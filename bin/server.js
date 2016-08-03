#!/usr/bin/env node

// Use strict mode in all project modules
'use strict';
require('use-strict');

// Add process configuration to config module and store back on process
const config = require('config');
process.config = Object.assign(config, process.config);

// Use cluster - Initialize worker instances
if (config.cluster) {
  const cluster = require('express-cluster');

  cluster(config.cluster, worker => {
    process.worker = worker;
    require('./instance');
  });

// Don't use cluster - Initialize single server instance in master process
} else {
  require('./instance');
}
