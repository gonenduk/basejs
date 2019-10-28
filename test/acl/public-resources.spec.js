const assert = require('assert').strict;
const Boom = require('@hapi/boom');
require('../../acl');
const publicResourceACL = require('../../acl/resources/public');

const guest = { role: 'guest' };
const none = { role: 'none' };

const req = {};
const res = {};
const next = () => {};

describe('Access control for public resources', () => {
  beforeEach(() => {
    req.query = {};
  });

  context('Get list', () => {
    it('should allow guest to read', () => {
      req.user = guest;
      assert.doesNotThrow(() => { publicResourceACL.get(req, res, next); });
    });

    it('should not allow undefined role to read', () => {
      req.user = none;
      assert.throws(() => { publicResourceACL.get(req, res, next); }, Boom.forbidden());
    });
  });

  context('Get resource', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => { publicResourceACL[':id'].get(req, res, next); });
    });

    it('should not allow undefined role to read any', () => {
      req.user = none;
      assert.throws(() => { publicResourceACL[':id'].get(req, res, next); }, Boom.forbidden());
    });
  });
});
