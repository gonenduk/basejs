const sinon = require('sinon');
const { products } = require('../../acl');
const pr = require('../../acl/public-resource');

describe('Access control for products', () => {
  let getMany;
  let create;
  let getOne;
  let updateOne;
  let deleteOne;
  let updateOwner;

  before(() => {
    getMany = sinon.stub(pr, 'getMany');
    create = sinon.stub(pr, 'create');
    getOne = sinon.stub(pr, 'getOne');
    updateOne = sinon.stub(pr, 'updateOne');
    deleteOne = sinon.stub(pr, 'deleteOne');
    updateOwner = sinon.stub(pr, 'updateOwner');
  });

  after(() => {
    sinon.restore();
  });

  it('should be a public resource', () => {
    products.getProducts();
    products.createProduct();
    products.getProduct();
    products.updateProduct();
    products.deleteProduct();
    products.updateProductOwner();
    sinon.assert.calledOnce(getMany);
    sinon.assert.calledOnce(create);
    sinon.assert.calledOnce(getOne);
    sinon.assert.calledOnce(updateOne);
    sinon.assert.calledOnce(deleteOne);
    sinon.assert.calledOnce(updateOwner);
  });
});
