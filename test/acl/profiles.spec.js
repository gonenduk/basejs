const assert = require('assert').strict;
require('../../acl');
const profilesACL = require('../../acl/profiles');

const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };

const req = { params: {} };
const res = {};
const next = () => {};

describe.skip('Access control for /profiles', () => {
  context('Get resource', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      req.params.id = user;
      assert.doesNotThrow(() => { profilesACL[':id'].get(req, res, next); });
    });
  });
});
