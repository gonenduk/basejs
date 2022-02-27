const assert = require('assert').strict;
const { users } = require('../../acl');

const req = { api: true, params: {} };
const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };

describe('Access control for users', () => {
  context('Get user list', () => {
    it('should allow moderator to read', () => {
      req.user = moderator;
      assert.doesNotThrow(() => users.getUsers(req));
    });

    it('should not allow user to read', () => {
      req.user = user;
      assert.throws(() => users.getUsers(req));
    });
  });

  context('Create user', () => {
    it('should allow guest to create', () => {
      assert.equal(users.createUser, undefined);
    });
  });

  context('Get user', () => {
    it('should allow user to read own', () => {
      req.user = user;
      req.params.id = req.user.id;
      assert.doesNotThrow(() => users.getUser(req));
    });

    it('should allow moderator to read any', () => {
      req.user = moderator;
      assert.doesNotThrow(() => users.getUser(req));
    });

    it('should not allow user to read any', () => {
      req.user = user;
      req.params.id = undefined;
      assert.throws(() => users.getUser(req));
    });
  });

  context('Update user', () => {
    it('should allow user to update own', () => {
      req.user = user;
      req.params.id = req.user.id;
      assert.doesNotThrow(() => users.updateUser(req));
    });

    it('should not allow moderator to update any', () => {
      req.user = moderator;
      assert.throws(() => users.updateUser(req));
    });

    it('should allow admin to update any', () => {
      req.user = admin;
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
      assert.doesNotThrow(() => users.updateUserRole(req));
    });
  });
});
