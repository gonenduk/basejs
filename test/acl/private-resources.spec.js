const assert = require('assert').strict;
const acl = require('../../acl');

const PrivateResource = acl['private-resource'];
const pr = new PrivateResource();

const req = { api: true, params: {} };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };

describe('Access control for private resources', () => {
  beforeEach(() => {
    req.query = {};
  });

  context('Get many', () => {
    it('should not allow guest to read', () => {
      req.user = guest;
      assert.throws(() => pr.getMany(req));
    });

    it('should limit user to read own', () => {
      req.user = user;
      assert.doesNotThrow(() => pr.getMany(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: user.id }));
    });

    it('should not allow user to read others', () => {
      req.user = user;
      req.query.filter = JSON.stringify({ ownerId: moderator.id });
      assert.throws(() => pr.getMany(req));
    });

    it('should allow moderator to read any', () => {
      req.user = moderator;
      assert.doesNotThrow(() => pr.getMany(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Get resource', () => {
    it('should not allow guest to read', () => {
      req.user = guest;
      assert.throws(() => pr.getOne(req));
    });

    it('should limit user to read own', () => {
      req.user = user;
      assert.doesNotThrow(() => pr.getOne(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: user.id }));
    });

    it('should allow moderator to read any', () => {
      req.user = moderator;
      assert.doesNotThrow(() => pr.getMany(req));
      assert.equal(req.query.filter, undefined);
    });
  });
});
