const assert = require('assert').strict;
const sinon = require('sinon');
const { auth } = require('../../handlers');
const user = require('../../models/user');
const jwt = require('../../lib/jwt');
const oauth = require('../../lib/oauth');

const req = {
  api: true,
  params: {},
  body: {},
  user: {},
};
const res = { json: () => {}, status: () => res, end: () => {} };

describe('Handler of authentication', () => {
  let getOneStub;
  let getOneByIdStub;
  let validatePasswordStub;
  let logoutStub;
  let signAccessTokenStub;
  let signRefreshTokenStub;
  let verifyTokenStub;
  let isProviderSupported;
  let validateWithProviderStub;
  let jsonStub;

  before(() => {
    getOneStub = sinon.stub(user, 'getOneByFilter');
    getOneByIdStub = sinon.stub(user, 'getOneById');
    validatePasswordStub = sinon.stub(user, 'validatePassword');
    logoutStub = sinon.stub(user, 'signOut');
    signAccessTokenStub = sinon.stub(jwt, 'signAccessToken');
    signRefreshTokenStub = sinon.stub(jwt, 'signRefreshToken');
    verifyTokenStub = sinon.stub(jwt, 'verifyToken');
    isProviderSupported = sinon.stub(oauth, 'isProviderSupported');
    validateWithProviderStub = sinon.stub(oauth, 'validateWithProvider');
    jsonStub = sinon.stub(res, 'json');
  });

  after(() => {
    sinon.restore();
  });

  context('Create access and refresh tokens from username and password', () => {
    it('should fail on invalid user', async () => {
      await assert.rejects(() => auth.signInWithCredentials(req, res));
    });

    it('should fail on invalid password', async () => {
      getOneStub.resolves({});
      await assert.rejects(() => auth.signInWithCredentials(req, res));
    });

    it('should return access and refresh tokens on success', async () => {
      getOneStub.resolves({});
      validatePasswordStub.resolves(true);
      signAccessTokenStub.resolves('ta');
      signRefreshTokenStub.resolves('tr');
      await assert.doesNotReject(() => auth.signInWithCredentials(req, res));
      sinon.assert.calledWith(jsonStub, { access_token: 'ta', refresh_token: 'tr' });
    });

    it('should fail if cannot create tokens', async () => {
      signAccessTokenStub.rejects(Error('e'));
      await assert.rejects(() => auth.signInWithCredentials(req, res));
    });
  });

  context('Delete token', () => {
    it('should always succeed', async () => {
      logoutStub.resolves();
      await auth.signOut(req, res);
      await assert.doesNotReject(() => auth.signOut(req, res));
    });
  });

  context('Create access and refresh tokens from refresh token', () => {
    it('should fail on invalid token', async () => {
      verifyTokenStub.rejects(Error('e'));
      await assert.rejects(() => auth.signInWithRefreshToken(req, res));
    });

    it('should fail on invalid user in token', async () => {
      verifyTokenStub.resolves({ id: '1' });
      getOneByIdStub.resolves();
      await assert.rejects(() => auth.signInWithRefreshToken(req, res));
    });

    it('should fail after logout', async () => {
      verifyTokenStub.resolves({ id: '1', iat: 1 });
      getOneByIdStub.resolves({ signedOutAt: new Date() });
      await assert.rejects(() => auth.signInWithRefreshToken(req, res));
    });

    it('should return access and refresh tokens on success', async () => {
      verifyTokenStub.resolves({ id: '1', iat: Date.now() * 2 });
      getOneByIdStub.resolves({});
      signAccessTokenStub.resolves('ta');
      signRefreshTokenStub.resolves('tr');
      jsonStub.reset();
      await assert.doesNotReject(() => auth.signInWithRefreshToken(req, res));
      sinon.assert.calledWith(jsonStub, { access_token: 'ta', refresh_token: 'tr' });
    });
  });

  context('Create access and refresh tokens from oauth token', () => {
    it('should fail on unknown provider', async () => {
      isProviderSupported.returns(false);
      await assert.rejects(() => auth.signInWithOAuthToken(req, res));
    });

    it('should fail if token not valid by provider', async () => {
      isProviderSupported.returns(true);
      validateWithProviderStub.rejects(Error());
      await assert.rejects(() => auth.signInWithOAuthToken(req, res));
    });

    it('should fail if user in token not found', async () => {
      validateWithProviderStub.resolves({});
      getOneStub.resolves();
      await assert.rejects(() => auth.signInWithOAuthToken(req, res));
    });

    it('should return access and refresh tokens on success', async () => {
      getOneStub.resolves({});
      signAccessTokenStub.resolves('ta');
      signRefreshTokenStub.resolves('tr');
      jsonStub.reset();
      await assert.doesNotReject(() => auth.signInWithOAuthToken(req, res));
      sinon.assert.calledWith(jsonStub, { access_token: 'ta', refresh_token: 'tr' });
    });
  });
});
