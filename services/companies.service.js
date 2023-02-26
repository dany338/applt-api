const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class CompaniesService {
  constructor() {}

  async create(data) {
    const company = await models.Company.create(data);
    const companies = this.findOne(company.id);
    return companies;
  }

  async findByUser(userId) {
    const companies = await models.Invoice.findAll({
      where: {
        updatedUser: userId,
      },
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'firstName', 'lastName'],
        }
      ],
      order: [
        ['id', 'DESC'],
      ]
    });
    return companies;
  }

  async find(query) {
    const options = {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'firstName', 'lastName'],
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
    const { userId } = query;
    if (userId) {
      options.where.userId = userId;
    }
    const companies = await models.Company.findAll(options);
    return companies;
  }

  async findOne(id) {
    const company = await models.Company.findByPk(id, {
      include: [
        {
          model: models.User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'firstName', 'lastName'],
        }
      ],
    });
    if (!company) {
      throw boom.notFound('company not found');
    }
    return company;
  }

  async update(id, changes) {
    const company = await this.findOne(id);
    await company.update(changes);
    const rta = this.findOne(company.id);
    return rta;
  }

  async delete(id) {
    const company = await this.findOne(id);
    await company.destroy();
    return { id };
  }
}

module.exports = CompaniesService;
