const BaseHandler = require('./base-handler');
const model = require('../models/ticket');

const baseHandler = new BaseHandler(model);

module.exports = {
  getTickets: (req, res) => baseHandler.getMany(req, res),
  createTicket: (req, res) => baseHandler.create(req, res),
  getTicket: (req, res) => baseHandler.getOne(req, res),
  updateTicket: (req, res) => baseHandler.updateOne(req, res),
  deleteTicket: (req, res) => baseHandler.deleteOne(req, res),
  updateTicketOwner: (req, res) => baseHandler.updateOwner(req, res),
};
