const assert = require('assert').strict;
const Boom = require('@hapi/boom');
require('../../acl');
const ac = require('../../lib/acl');
const usersACL = require('../../acl/users');

const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };
const none = { role: 'none' };

const req = { params: {} };
const res = {};
const next = () => {};

describe('Access control for /users', () => {
  before(() => {
    ac.grant('none');
  });

  context('Get user list', () => {
    it('should allow moderator to read', () => {
      req.user = moderator;
      assert.doesNotThrow(() => { usersACL.get(req, res, next); });
    });

    it('should not allow user to read', () => {
      req.user = user;
      assert.throws(() => { usersACL.get(req, res, next); }, Boom.forbidden());
    });
  });

  context('Create user', () => {
    it('should allow guest to create', () => {
      req.user = guest;
      assert.doesNotThrow(() => { usersACL.post(req, res, next); });
    });

    it('should not allow undefined role to create', () => {
      req.user = none;
      assert.throws(() => { usersACL.post(req, res, next); }, Boom.forbidden());
    });
  });

  context('Get user', () => {
    it('should allow user to read own', () => {
      req.user = user;
      req.params.id = user.id;
      assert.doesNotThrow(() => { usersACL[':id'].get(req, res, next); });
    });

    it('should allow moderator to read any', () => {
      req.user = moderator;
      req.params.id = admin.id;
      assert.doesNotThrow(() => { usersACL[':id'].get(req, res, next); });
    });

    it('should not allow user to read any', () => {
      req.user = user;
      req.params.id = moderator.id;
      assert.throws(() => { usersACL[':id'].get(req, res, next); }, Boom.forbidden());
    });
  });

  context('Update user', () => {
    it('should allow user to update own', () => {
      req.user = user;
      req.params.id = user.id;
      assert.doesNotThrow(() => { usersACL[':id'].patch(req, res, next); });
    });

    it('should not allow moderator to update any', () => {
      req.user = moderator;
      req.params.id = user.id;
      assert.throws(() => { usersACL[':id'].patch(req, res, next); }, Boom.forbidden());
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      req.params.id = user.id;
      assert.doesNotThrow(() => { usersACL[':id'].patch(req, res, next); });
    });
  });

  context('Update user role', () => {
    it('should not allow moderator to update own', () => {
      req.user = moderator;
      req.params.id = moderator.id;
      assert.throws(() => { usersACL[':id'].role.put(req, res, next); }, Boom.forbidden());
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      req.params.id = user.id;
      assert.doesNotThrow(() => { usersACL[':id'].role.put(req, res, next); });
    });
  });
});
