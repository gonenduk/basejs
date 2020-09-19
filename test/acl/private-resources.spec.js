const assert = require('assert').strict;
const Boom = require('@hapi/boom');
require('../../acl');
const privateResourceACL = require('../../acl/validations/private');

const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };

const req = {};
const res = {};
const next = () => {};

describe.skip('Access control for private resources', () => {
  beforeEach(() => {
    req.query = {};
  });

  context('Get list', () => {
    it('should allow moderator to read', () => {
      req.user = moderator;
      assert.doesNotThrow(() => { privateResourceACL.get(req, res, next); });
    });

    it('should not allow user to read', () => {
      req.user = user;
      assert.throws(() => { privateResourceACL.get(req, res, next); }, Boom.forbidden());
    });
  });

  context('Get resource', () => {
    it('should allow user to read own', () => {
      req.user = user;
      assert.doesNotThrow(() => { privateResourceACL[':id'].get(req, res, next); });
      assert.deepEqual(req.query.filter, { ownerId: req.user.id });
    });

    it('should allow moderator to read any', () => {
      req.user = moderator;
      assert.doesNotThrow(() => { privateResourceACL[':id'].get(req, res, next); });
      assert.equal(req.query.filter, undefined);
    });

    it('should not allow user to read any', () => {
      req.user = user;
      assert.doesNotThrow(() => { privateResourceACL[':id'].get(req, res, next); });
      assert.deepEqual(req.query.filter, { ownerId: req.user.id });
    });
  });
});
