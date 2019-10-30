const assert = require('assert').strict;
const Boom = require('@hapi/boom');
require('../../acl');
const ac = require('../../lib/acl');
const publicResourceACL = require('../../acl/resources/public');

const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };
const dummy = { role: 'dummy' };

const req = { params: {} };
const res = {};
const next = () => {};

describe('Access control for resources', () => {
  beforeEach(() => {
    req.query = {};
  });

  context('Create resource', () => {
    it('should allow user to create', () => {
      req.user = user;
      assert.doesNotThrow(() => { publicResourceACL.post(req, res, next); });
    });

    it('should not allow guest to create', () => {
      req.user = guest;
      assert.throws(() => { publicResourceACL.post(req, res, next); }, Boom.forbidden());
    });
  });

  context('Update resource', () => {
    it('should allow user to update own', () => {
      req.user = user;
      assert.doesNotThrow(() => { publicResourceACL[':id'].patch(req, res, next); });
      assert.deepEqual(req.query.filter, { ownerId: req.user.id });
    });

    it('should not allow guest to update any', () => {
      req.user = guest;
      assert.throws(() => { publicResourceACL[':id'].patch(req, res, next); }, Boom.forbidden());
    });

    it('should not allow moderator to update any', () => {
      req.user = moderator;
      assert.doesNotThrow(() => { publicResourceACL[':id'].patch(req, res, next); });
      assert.deepEqual(req.query.filter, { ownerId: req.user.id });
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      assert.doesNotThrow(() => { publicResourceACL[':id'].patch(req, res, next); });
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Delete resource', () => {
    it('should allow user to delete own', () => {
      req.user = user;
      assert.doesNotThrow(() => { publicResourceACL[':id'].delete(req, res, next); });
      assert.deepEqual(req.query.filter, { ownerId: req.user.id });
    });

    it('should not allow guest to delete any', () => {
      req.user = guest;
      assert.throws(() => { publicResourceACL[':id'].delete(req, res, next); }, Boom.forbidden());
    });

    it('should not allow moderator to delete any', () => {
      req.user = moderator;
      assert.doesNotThrow(() => { publicResourceACL[':id'].delete(req, res, next); });
      assert.deepEqual(req.query.filter, { ownerId: req.user.id });
    });

    it('should allow admin to delete any', () => {
      req.user = admin;
      assert.doesNotThrow(() => { publicResourceACL[':id'].delete(req, res, next); });
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Update resource ownership', () => {
    it('should not allow moderator to update own', () => {
      req.user = moderator;
      assert.throws(() => { publicResourceACL[':id'].owner.put(req, res, next); }, Boom.forbidden());
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      assert.doesNotThrow(() => { publicResourceACL[':id'].owner.put(req, res, next); });
    });

    it('should allow dummy to update own', () => {
      ac.grant('dummy').updateOwn('resource-owner');
      req.user = dummy;
      assert.doesNotThrow(() => { publicResourceACL[':id'].owner.put(req, res, next); });
      assert.deepEqual(req.query.filter, { ownerId: req.user.id });
    });

    after(() => {
      ac.deny('dummy').updateOwn('resource-owner');
    });
  });
});
