/* eslint newline-per-chained-call: "off" */
const requireDirectory = require('require-directory');
const ac = require('../lib/acl');

// Access control definitions
ac.grant('guest')
  .readAny('public-resource')
  .readAny('webpage')

  .grant('user').extend('guest')
  .createOwn('resource').updateOwn('resource').deleteOwn('resource')
  .readOwn('private-resource')

  .grant('moderator').extend('user')
  .readAny('private-resource')

  .grant('admin').extend('moderator')
  .updateAny('resource').deleteAny('resource')
  .updateAny('resource-system');

module.exports = requireDirectory(module, { recurse: false });
