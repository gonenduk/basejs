const assert = require('assert').strict;
const Boom = require('@hapi/boom');
require('../../acl');
const resourceACL = require('../../acl/resource');

const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };

const req = { params: {} };
const res = {};
const next = () => {};


describe('Access control for public resources', () => {
  context('Get list', () => {
    it('should allow guest to read', () => {
      req.user = guest;
      assert.doesNotThrow(() => { resourceACL.get(req, res, next); });
    });
  });

  context('Create resource', () => {
    it('should allow user to create', () => {
      req.user = user;
      assert.doesNotThrow(() => { resourceACL.post(req, res, next); });
    });

    it('should not allow guest to create', () => {
      req.user = guest;
      assert.throws(() => { resourceACL.post(req, res, next); }, Boom.forbidden());
    });
  });

  context('Get resource', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      req.params.id = user.id;
      assert.doesNotThrow(() => { resourceACL[':id'].get(req, res, next); });
    });
  });

  context.skip('Update resource', () => {
    it('should allow user to update own', () => {
      req.user = user;
      req.params.id = user.id;
      assert.doesNotThrow(() => { resourceACL[':id'].patch(req, res, next); });
    });

    it('should not allow user to update any', () => {
      req.user = user;
      req.params.id = moderator.id;
      assert.throws(() => { resourceACL[':id'].patch(req, res, next); }, Boom.forbidden());
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      req.params.id = user.id;
      assert.doesNotThrow(() => { resourceACL[':id'].patch(req, res, next); });
    });
  });

  context.skip('Update resource ownership', () => {
    it('should not allow moderator to update own', () => {
      req.user = moderator;
      req.params.id = moderator.id;
      assert.throws(() => { resourceACL[':id'].role.put(req, res, next); }, Boom.forbidden());
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      req.params.id = user.id;
      assert.doesNotThrow(() => { resourceACL[':id'].role.put(req, res, next); });
    });
  });
});
