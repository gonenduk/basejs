#!/usr/bin/env node

// Use strict mode in all project modules
'use strict';
require('use-strict');

// Add process configuration to config module and store back on process
const config = require('config');
process.config = Object.assign(config, process.config);

// Load modules
const cluster = require('express-cluster');

// Initialize server instances with configuration
if (config.cluster) {
  cluster(worker => {
    require('./instance')(worker);
  }, config.cluster);

// Initialize single server in master process
} else {
  require('./instance')();
}
