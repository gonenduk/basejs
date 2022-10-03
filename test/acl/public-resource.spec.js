const assert = require('assert').strict;
const acl = require('../../acl');

const PublicResource = acl['public-resource'];
const pr = new PublicResource();

const req = { api: true, params: {} };
const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };

describe('Access control for public resources', () => {
  beforeEach(() => {
    req.query = {};
  });

  context('Get many', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => pr.getMany(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Create resource', () => {
    it('should not allow guest to create', () => {
      req.user = guest;
      assert.throws(() => pr.create(req));
    });

    it('should allow user to create', () => {
      req.user = user;
      assert.doesNotThrow(() => pr.create(req));
    });
  });

  context('Get resource', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => pr.getOne(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Update resource', () => {
    it('should not allow guest to update', () => {
      req.user = guest;
      assert.throws(() => pr.updateOne(req));
    });

    it('should limit user to update own', () => {
      req.user = user;
      assert.doesNotThrow(() => pr.updateOne(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: user.id }));
    });

    it('should limit moderator to update own', () => {
      req.user = moderator;
      assert.doesNotThrow(() => pr.updateOne(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: moderator.id }));
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      assert.doesNotThrow(() => pr.updateOne(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Delete resource', () => {
    it('should not allow guest to delete', () => {
      req.user = guest;
      assert.throws(() => pr.deleteOne(req));
    });

    it('should limit user to delete own', () => {
      req.user = user;
      req.query = {};
      assert.doesNotThrow(() => pr.deleteOne(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: user.id }));
    });

    it('should limit moderator to delete own', () => {
      req.user = moderator;
      req.query = {};
      assert.doesNotThrow(() => pr.deleteOne(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: moderator.id }));
    });

    it('should not limit admin to delete any', () => {
      req.user = admin;
      req.query = {};
      assert.doesNotThrow(() => pr.deleteOne(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Update resource ownership', () => {
    it('should not allow moderator to update own', () => {
      req.user = moderator;
      assert.throws(() => pr.updateOwner(req));
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      assert.doesNotThrow(() => pr.updateSystem(req));
      assert.equal(req.query.filter, undefined);
    });
  });
});
