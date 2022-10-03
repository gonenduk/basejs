const assert = require('assert').strict;
const acl = require('../../acl');

const { users } = acl;

const req = { api: true };
const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };

describe('Access control for users', () => {
  beforeEach(() => {
    req.params = {};
  });

  context('Get user list', () => {
    it('should not allow user to read', () => {
      req.user = user;
      assert.throws(() => users.getUsers(req));
    });

    it('should allow moderator to read any', () => {
      req.user = moderator;
      assert.doesNotThrow(() => users.getUsers(req));
    });
  });

  context('Create user', () => {
    it('should allow guest to create', () => {
      assert.equal(users.createUser, undefined);
    });
  });

  context('Get user', () => {
    it('should not allow user to read any', () => {
      req.user = user;
      req.params.id = moderator.id;
      assert.throws(() => users.getUser(req));
    });

    it('should allow user to read own', () => {
      req.user = user;
      req.params.id = user.id;
      assert.doesNotThrow(() => users.getUser(req));
    });

    it('should allow moderator to read any', () => {
      req.user = moderator;
      req.params.id = user.id;
      assert.doesNotThrow(() => users.getUser(req));
    });
  });

  context('Update user', () => {
    it('should not allow moderator to update any', () => {
      req.user = moderator;
      req.params.id = user.id;
      assert.throws(() => users.updateUser(req));
    });

    it('should allow user to update own', () => {
      req.user = user;
      req.params.id = user.id;
      assert.doesNotThrow(() => users.updateUser(req));
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      req.params.id = moderator.id;
      assert.doesNotThrow(() => users.updateUser(req));
    });
  });

  context('Update user role', () => {
    it('should not allow moderator to update own', () => {
      req.user = moderator;
      req.params.id = req.user.id;
      assert.throws(() => users.updateUserRole(req));
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      req.params.id = moderator.id;
      assert.doesNotThrow(() => users.updateUserRole(req));
    });
  });
});
