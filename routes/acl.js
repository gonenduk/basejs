const ac = require('../lib/acl');

// Access control definitions
ac.grant('guest')
  .createOwn('user', ['*', '!role'])
  .readAny('profile')
  .readAny('resource')
  .readAny('webpage')
  .grant('user').extend('guest')
  .readOwn('user').updateOwn('user', ['*', '!role'])
  .createOwn('resource').updateOwn('resource', ['*', '!ownerId']).deleteOwn('resource')
  .grant('moderator').extend('user')
  .readAny('user')
  .grant('admin').extend('moderator')
  .updateAny('user')
  .createAny('resource').updateAny('resource').deleteAny('resource');
