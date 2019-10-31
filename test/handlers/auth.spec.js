const assert = require('assert').strict;
const sinon = require('sinon');
const Boom = require('@hapi/boom');
const user = require('../../models/user');
const jwt = require('../../lib/jwt');
const authHandler = require('../../handlers').auth;

const req = {};
const res = {};

describe('Handler of /auth', () => {
  req.body = { username: 'user', password: 'password' };
  const getOneStub = sinon.stub(user, 'getOne');
  const validatePasswordStub = sinon.stub(user, 'validatePassword');
  const signAccessTokenStub = sinon.stub(jwt, 'signAccessToken').resolves('ta');
  const signRefreshTokenStub = sinon.stub(jwt, 'signRefreshToken').resolves('tr');

  beforeEach(() => {
    sinon.resetHistory();
  });

  after(() => {
    getOneStub.restore();
    validatePasswordStub.restore();
    signAccessTokenStub.restore();
    signRefreshTokenStub.restore();
  });

  context('Create access and refresh tokens from username and password', () => {
    it('should fail on invalid user', async () => {
      await assert.rejects(() => authHandler.token.post(req, res), Boom.unauthorized('Incorrect username or password'));
    });

    it('should fail on invalid password', async () => {
      getOneStub.resolves({});
      await assert.rejects(() => authHandler.token.post(req, res), Boom.unauthorized('Incorrect username or password'));
    });

    it('should return access and refresh tokens on success', async () => {
      getOneStub.resolves({});
      validatePasswordStub.resolves(true);
      res.json = (obj) => {
        assert.deepEqual(obj, { access_token: 'ta', refresh_token: 'tr' });
      };
      await assert.doesNotReject(() => authHandler.token.post(req, res));
    });

    it('should return access and refresh tokens on success', async () => {
      res.json = () => res;
      signAccessTokenStub.rejects(Error('e'));
      await assert.rejects(() => authHandler.token.post(req, res), Boom.unauthorized('Failed to sign user tokens: e'));
    });
  });

  context('Delete token', () => {
    req.user = { id: '1' };
    res.status = () => res;
    res.end = () => res;
    const logoutStub = sinon.stub(user, 'logout').resolves();

    after(() => {
      logoutStub.restore();
    });

    it('should always succeed', async () => {
      await assert.doesNotReject(() => authHandler.token.delete(req, res));
    });
  });
});
