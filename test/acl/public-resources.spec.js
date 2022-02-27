const assert = require('assert').strict;
const acl = require('../../acl');

const pr = acl['public-resource'];

const req = { api: true, params: {} };
const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };

describe('Access control for public resources', () => {
  context('Get many', () => {
    it('should allow guest to read', () => {
      req.user = guest;
      assert.doesNotThrow(() => pr.getMany(req));
    });
  });

  context('Create resource', () => {
    it('should allow user to create', () => {
      req.user = user;
      assert.doesNotThrow(() => pr.create(req));
    });

    it('should not allow guest to create', () => {
      req.user = guest;
      assert.throws(() => pr.create(req));
    });
  });

  context('Get resource', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => pr.getOne(req));
    });
  });

  context('Update resource', () => {
    it('should allow user to update own', () => {
      req.user = user;
      assert.doesNotThrow(() => pr.updateOne(req));
    });

    it('should limit moderator to update own', () => {
      req.user = moderator;
      req.query = {};
      assert.doesNotThrow(() => pr.updateOne(req));
      assert.equal(req.query.filter?.ownerId, req.user.id);
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      assert.doesNotThrow(() => pr.updateOne(req));
    });
  });

  context('Delete resource', () => {
    it('should limit user to delete own', () => {
      req.user = user;
      req.query = {};
      assert.doesNotThrow(() => pr.deleteOne(req));
      assert.equal(req.query.filter?.ownerId, req.user.id);
    });

    it('should limit moderator to delete own', () => {
      req.user = moderator;
      req.query = {};
      assert.doesNotThrow(() => pr.deleteOne(req));
      assert.equal(req.query.filter?.ownerId, req.user.id);
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
      assert.doesNotThrow(() => pr.updateOwner(req));
    });
  });
});
