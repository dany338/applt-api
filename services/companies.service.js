const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
// const { Op } = require('sequelize');

class InvoicesService {
  constructor() {}

  async create(data) {
    const invoice = await models.Invoice.create(data);
    const newLines = data.lines.map(line => ({ ...line, invoiceId: invoice.id }));
    const lines = await models.Line.bulkCreate(newLines);
    if (lines) {
      invoice.lines = lines;
    }
    const invoices = this.findOne(invoice.id);
    return invoices;
  }

  async findByUser(userId) {
    const invoices = await models.Invoice.findAll({
      where: {
        updatedUser: userId, // '$cashier.user.id$'
      },
      include: [
        {
          model: models.Client,
          as: 'client',
          attributes: ['id', 'dni', 'firstName', 'lastName'],
        },
        {
          model: models.Line,
          as: 'lines',
          attributes: ['id', 'description', 'amount'],
        }
      ],
      order: [
        ['id', 'DESC'],
      ]
    });
    return invoices;
  }

  async find(query) {
    const options = {
      include: [
        {
          model: models.Client,
          as: 'client',
          attributes: ['id', 'dni', 'firstName', 'lastName'],
        },
        {
          model: models.Line,
          as: 'lines',
          attributes: ['id', 'description', 'amount'],
        }
      ],
      order: [
        ['id', 'DESC'],
      ],
      where: {},
    };
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = limit;
      options.offset = offset;
    }
    const { date, clientId } = query;
    if (date && clientId) {
      options.where.date = date;
      options.where.clientId = clientId;
      // options.where.date = { [Op.gte]: date_min, [Op.lte]: date_max };
    }
    const invoices = await models.Invoice.findAll(options);
    return invoices;
  }

  async findOne(id) {
    const invoice = await models.Invoice.findByPk(id, {
      include: [
        {
          model: models.Client,
          as: 'client',
          attributes: ['id', 'dni', 'firstName', 'lastName'],
        },
        {
          model: models.Line,
          as: 'lines',
          attributes: ['id', 'description', 'amount'],
        }
      ],
    });
    if (!invoice) {
      throw boom.notFound('invoice not found');
    }
    return invoice;
  }

  async update(id, changes) {
    const invoice = await this.findOne(id);
    const { lines, ...newChanges } = changes;
    await invoice.update(newChanges);
    const newLines = lines.map(line => ({ ...line, invoiceId: invoice.id }));
    for(const item of newLines) {
      const line = await models.Line.findByPk(item.id);
      if (line) {
        await line.update(item);
      } else {
        await models.Line.create(item);
      }
    }
    const rta = this.findOne(invoice.id);
    return rta;
  }

  async delete(id) {
    const invoice = await this.findOne(id);
    await invoice.destroy();
    return { id };
  }
}

module.exports = InvoicesService;
