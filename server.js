#!/usr/bin/env node

// Use strict mode in all project modules
'use strict';
require('use-strict');

// Place configuration, logger and bluebird in global object
global.config = require('config');
global.logger = require('./modules/logger');
global.Promise = require('bluebird');

// Cluster support
config.server = config.server || {};
const cluster = require('./modules/cluster');

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
