const sinon = require('sinon');
const acl = require('../../acl');

const { tickets } = acl;

describe('Access control for tickets', () => {
  let getMany;
  let create;
  let getOne;
  let updateOne;
  let deleteOne;
  let updateOwner;

  before(() => {
    getMany = sinon.stub(tickets, 'getMany');
    create = sinon.stub(tickets, 'create');
    getOne = sinon.stub(tickets, 'getOne');
    updateOne = sinon.stub(tickets, 'updateOne');
    deleteOne = sinon.stub(tickets, 'deleteOne');
    updateOwner = sinon.stub(tickets, 'updateSystem');
  });

  after(() => {
    sinon.restore();
  });

  it('should map to a private resource', () => {
    tickets.getTickets();
    tickets.createTicket();
    tickets.getTicket();
    tickets.updateTicket();
    tickets.deleteTicket();
    tickets.updateTicketOwner();
    sinon.assert.calledOnce(getMany);
    sinon.assert.calledOnce(create);
    sinon.assert.calledOnce(getOne);
    sinon.assert.calledOnce(updateOne);
    sinon.assert.calledOnce(deleteOne);
    sinon.assert.calledOnce(updateOwner);
  });
});
