const assert = require('assert').strict;
const acl = require('../../acl');

const req = { api: true, params: {} };
const guest = { role: 'guest' };

describe('Access control for profiles', () => {
  context('Get profile', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => acl.profiles.getProfile(req));
    });
  });
});
