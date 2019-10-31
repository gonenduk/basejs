const assert = require('assert').strict;
const sinon = require('sinon');
const Boom = require('@hapi/boom');
const user = require('../../models/user');
const authHandler = require('../../handlers/auth');

const req = {};
const res = {};

describe('Handler of /auth', () => {
  const getOneStub = sinon.stub(user, 'getOne');
  const validatePasswordStub = sinon.stub(user, 'validatePassword');

  beforeEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    getOneStub.restore();
    validatePasswordStub.restore();
  });

  context('Create access and refresh tokens from username and password', () => {
    it('should fail on invalid user', async () => {
      req.body = { username: 'user', password: 'password' };
      await assert.rejects(() => authHandler.token.post(req, res), Boom.unauthorized('Incorrect username or password'));
    });

    it('should fail on invalid password', async () => {
      req.body = { username: 'user', password: 'password' };
      getOneStub.resolves({});
      await assert.rejects(() => authHandler.token.post(req, res), Boom.unauthorized('Incorrect username or password'));
    });

    it('should return access and refresh tokens on success', async () => {
      req.body = { username: 'user', password: 'password' };
      getOneStub.resolves({});
      validatePasswordStub.resolves(true);
      res.json = (obj) => {
        assert(obj.access_token);
        assert(obj.refresh_token);
      };
      await assert.doesNotReject(() => authHandler.token.post(req, res));
    });
  });
});
