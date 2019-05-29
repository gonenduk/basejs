const express = require('express');
const requireDirectory = require('require-directory');

const all = express.Router();

const routers = requireDirectory(module, { recurse: false });
// eslint-disable-next-line no-restricted-syntax
for (const router of Object.values(routers)) {
  all.use(router);
}
// Export directory and subdirectories
module.exports = all;
