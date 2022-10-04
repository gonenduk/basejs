const PrivateResource = require('./private-resource');

class Tickets extends PrivateResource {
  getTickets(req) { this.getMany(req); }

  createTicket(req) { this.create(req); }

  getTicket(req) { this.getOne(req); }

  updateTicket(req) { this.updateOne(req); }

  deleteTicket(req) { this.deleteOne(req); }

  updateTicketOwner(req) { this.updateSystem(req); }
}

module.exports = new Tickets();
