/* eslint newline-per-chained-call: "off" */
const requireDirectory = require('require-directory');
const ac = require('../lib/acl');

// Access control definitions
ac.grant('none')
  .grant('guest')
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

module.exports = requireDirectory(module, { recurse: false });
