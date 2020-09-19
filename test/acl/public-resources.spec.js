const assert = require('assert').strict;
require('../../acl');
const publicResourceACL = require('../../acl/validations/public');

const guest = { role: 'guest' };

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
  });

  context('Get resource', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => { publicResourceACL[':id'].get(req, res, next); });
    });
  });
});
