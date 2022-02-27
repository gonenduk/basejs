/* eslint newline-per-chained-call: "off" */
const requireDirectory = require('require-directory');
const ac = require('../lib/acl');

// Access control definitions
ac.grant('guest')
  .readAny('resource-public')
  .readAny('webpage')

  .grant('user').extend('guest')
  .createOwn('resource').updateOwn('resource').deleteOwn('resource')
  .readOwn('resource')

  .grant('moderator').extend('user')
  .readAny('resource')

  .grant('admin').extend('moderator')
  .updateAny('resource').deleteAny('resource')
  .createAny('resource-system').updateAny('resource-system').deleteAny('resource-system')
  .readAny('resource-system');

module.exports = requireDirectory(module, { recurse: false });
