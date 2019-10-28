const assert = require('assert').strict;
const Boom = require('@hapi/boom');
require('../../acl');
const ac = require('../../lib/acl');
const profilesACL = require('../../acl/profiles');

const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };
const none = { role: 'none' };

const req = { params: {} };
const res = {};
const next = () => {};

describe('Access control for /profiles', () => {
  before(() => {
    ac.grant('none');
  });

  context('Get resource', () => {
    it('should allow user to read own', () => {
      req.user = user;
      req.params.id = user.id;
      assert.doesNotThrow(() => { profilesACL[':id'].get(req, res, next); });
    });

    it('should allow guest to read any', () => {
      req.user = guest;
      req.params.id = user;
      assert.doesNotThrow(() => { profilesACL[':id'].get(req, res, next); });
    });

    it('should not allow undefined role to read any', () => {
      req.user = none;
      assert.throws(() => { profilesACL[':id'].get(req, res, next); }, Boom.forbidden());
    });
  });
});
