#!/usr/bin/env node

// Use strict mode in all project modules
'use strict';
require('auto-strict');

// Place configuration, logger and bluebird in global object
/* global config, logger */
global.config = require('config');
global.logger = require('./lib/logger');
global.Promise = require('bluebird');

// Cluster support
config.server = config.server || {};
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
