/* eslint newline-per-chained-call: "off" */
const requireDirectory = require('require-directory');
const ac = require('../lib/acl');

// Access control definitions
ac.grant('none')

  .grant('guest')
  .createOwn('user')
  .readAny('public-resource')
  .readAny('webpage')

  .grant('user').extend('guest')
  .createOwn('resource').updateOwn('resource').deleteOwn('resource')
  .readOwn('private-resource')

  .grant('moderator').extend('user')
  .readAny('private-resource')

  .grant('admin').extend('moderator')
  .updateAny('resource').deleteAny('resource')
  .updateAny('resource-owner')
  .updateAny('user-role');

module.exports = requireDirectory(module, { recurse: false });