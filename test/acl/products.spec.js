const sinon = require('sinon');
const acl = require('../../acl');

const { products } = acl;

describe('Access control for products', () => {
  let getMany;
  let create;
  let getOne;
  let updateOne;
  let deleteOne;
  let updateOwner;

  before(() => {
    getMany = sinon.stub(products, 'getMany');
    create = sinon.stub(products, 'create');
    getOne = sinon.stub(products, 'getOne');
    updateOne = sinon.stub(products, 'updateOne');
    deleteOne = sinon.stub(products, 'deleteOne');
    updateOwner = sinon.stub(products, 'updateSystem');
  });

  after(() => {
    sinon.restore();
  });

  it('should map to a public resource', () => {
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
