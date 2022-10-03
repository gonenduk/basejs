const assert = require('assert').strict;
const acl = require('../../acl');

const PrivateResource = acl['private-resource'];
const pr = new PrivateResource();

const req = { api: true, params: {} };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };

describe('General access control cases', () => {
  beforeEach(() => {
    req.query = {};
  });

  it('should not allow to provide ownerId when limited to own', () => {
    req.user = user;
    req.query.filter = JSON.stringify({ ownerId: moderator.id });
    assert.throws(() => pr.getMany(req));
  });

  it('should throw if filter provided is not an object', () => {
    req.user = user;
    req.query.filter = 1;
    assert.throws(() => pr.getMany(req));
  });

  it('should throw if filter provided cannot be parsed', () => {
    req.user = user;
    req.query.filter = 'a';
    assert.throws(() => pr.getMany(req));
  });
});
