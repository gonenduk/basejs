const assert = require('assert').strict;
const acl = require('../../acl');

const pr = acl['private-resource'];

const req = { api: true, params: {} };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };

describe('Access control for private resources', () => {
  context('Get many', () => {
    it('should allow moderator to read', () => {
      req.user = moderator;
      assert.doesNotThrow(() => pr.getMany(req));
    });

    it('should not allow user to read', () => {
      req.user = user;
      assert.throws(() => pr.getMany(req));
    });
  });

  context('Get resource', () => {
    it('should not allow guest to read', () => {
      req.user = guest;
      assert.throws(() => pr.getMany(req));
    });

    it('should limit user to read own', () => {
      req.user = user;
      req.query = {};
      assert.doesNotThrow(() => pr.getOne(req));
      assert.equal(req.query.filter?.ownerId, req.user.id);
    });

    it('should not limit moderator to read any', () => {
      req.user = moderator;
      req.query = {};
      assert.doesNotThrow(() => pr.getOne(req));
      assert.equal(req.query.filter, undefined);
    });
  });
});
