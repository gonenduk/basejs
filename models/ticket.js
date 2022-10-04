const BaseModel = require('./base-model');

class TicketModel extends BaseModel {
  constructor() {
    super('tickets', { ownership: true, timestamps: true });
  }
}

module.exports = new TicketModel();
