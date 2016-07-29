#!/usr/bin/env node

// Use strict mode in all project modules
'use strict';
require('use-strict');

// Load modules
const config = require('config');
const cluster = require('express-cluster');

// Initialize server instances with configuration
if (config.cluster) {
  cluster(worker => {
    require('./instance')(config, worker);
  }, config.cluster);

// Initialize single server in master process
} else {
  require('./instance')(config);
}
