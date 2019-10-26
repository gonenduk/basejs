/* eslint newline-per-chained-call: "off" */
const express = require('express');
const requireDirectory = require('require-directory');
const ac = require('../lib/acl');

// Access control definitions
ac.grant('guest')
  .createOwn('user')
  .readAny('profile')
  .readAny('resource')
  .readAny('webpage')
  .grant('user').extend('guest')
  .readOwn('user').updateOwn('user')
  .createOwn('resource').updateOwn('resource').deleteOwn('resource')
  .grant('moderator').extend('user')
  .readAny('user')
  .grant('admin').extend('moderator')
  .updateAny('user').updateAny('user-role')
  .updateAny('resource').deleteAny('resource').updateAny('resource-owner');

const all = express.Router();

const routers = requireDirectory(module, { recurse: false });
// eslint-disable-next-line no-restricted-syntax
for (const router of Object.values(routers)) {
  all.use(router);
}
// Export directory and subdirectories
module.exports = all;
