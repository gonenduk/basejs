const requireDirectory = require('require-directory');
const express = require('express');

const router = express.Router();

const handlers = requireDirectory(module, { recurse: false });
Object.values(handlers).forEach((handler) => router.use(handler));

module.exports = router;
