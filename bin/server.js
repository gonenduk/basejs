#!/usr/bin/env node

// Use strict mode in all project modules
require('use-strict');

// Load configuration
const config = require('config');

// Initialize server instance with configuration
require('./instance')(config);
