const assert = require('assert').strict;
const acl = require('../../acl');

const { products } = acl;

const req = { api: true, params: {} };
const admin = { role: 'admin', id: '1' };
const moderator = { role: 'moderator', id: '2' };
const user = { role: 'user', id: '3' };
const guest = { role: 'guest' };

describe('Access control for products', () => {
  beforeEach(() => {
    req.query = {};
  });

  context('Get product list', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => products.getProducts(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Create product', () => {
    it('should not allow guest to create', () => {
      req.user = guest;
      assert.throws(() => products.createProduct(req));
    });

    it('should allow user to create', () => {
      req.user = user;
      assert.doesNotThrow(() => products.createProduct(req));
    });
  });

  context('Get product', () => {
    it('should allow guest to read any', () => {
      req.user = guest;
      assert.doesNotThrow(() => products.getProduct(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Update product', () => {
    it('should not allow guest to update', () => {
      req.user = guest;
      assert.throws(() => products.updateProduct(req));
    });

    it('should limit user to update own', () => {
      req.user = user;
      assert.doesNotThrow(() => products.updateProduct(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: user.id }));
    });

    it('should limit moderator to update own', () => {
      req.user = moderator;
      assert.doesNotThrow(() => products.updateProduct(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: moderator.id }));
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      assert.doesNotThrow(() => products.updateProduct(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Delete product', () => {
    it('should not allow guest to delete', () => {
      req.user = guest;
      assert.throws(() => products.deleteProduct(req));
    });

    it('should limit user to delete own', () => {
      req.user = user;
      req.query = {};
      assert.doesNotThrow(() => products.deleteProduct(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: user.id }));
    });

    it('should limit moderator to delete own', () => {
      req.user = moderator;
      req.query = {};
      assert.doesNotThrow(() => products.deleteProduct(req));
      assert.equal(req.query.filter, JSON.stringify({ ownerId: moderator.id }));
    });

    it('should not limit admin to delete any', () => {
      req.user = admin;
      req.query = {};
      assert.doesNotThrow(() => products.deleteProduct(req));
      assert.equal(req.query.filter, undefined);
    });
  });

  context('Update product ownership', () => {
    it('should not allow moderator to update', () => {
      req.user = moderator;
      assert.throws(() => products.updateProductOwner(req));
    });

    it('should allow admin to update any', () => {
      req.user = admin;
      assert.doesNotThrow(() => products.updateProductOwner(req));
      assert.equal(req.query.filter, undefined);
    });
  });
});
