const assert = require('assert').strict;
const acl = require('../../acl');

const { profiles } = acl;

const req = { api: true, params: {}, query: {} };
const guest = { role: 'guest' };

describe('Access control for profiles', () => {
  context('Get profile', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => profiles.getProfile(req));
      assert.equal(req.query.filter, undefined);
    });
  });
});
