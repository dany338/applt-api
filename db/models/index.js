const { User, UserSchema } = require('./user.model');
const { Cashier, CashierSchema } = require('./cashier.model');
const { Client, ClientSchema} = require('./client.model');
const { Invoice, InvoiceSchema} = require('./invoice.model');
const { Line, LineSchema} = require('./line.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Cashier.init(CashierSchema, Cashier.config(sequelize));
  Client.init(ClientSchema, Client.config(sequelize));
  Invoice.init(InvoiceSchema, Invoice.config(sequelize));
  Line.init(LineSchema, Line.config(sequelize));

  User.associate(sequelize.models);
  Cashier.associate(sequelize.models);
  Client.associate(sequelize.models);
  Invoice.associate(sequelize.models);
  Line.associate(sequelize.models);
}

module.exports = setupModels;
