const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../libs/sequelize');

class UsersService {
  constructor() {}

  async create(data) {
    // const user = await models.User.create(data);
    const hash = await bcrypt.hash(data.password, 10);
    const user = await models.User.create({ ...data, password: hash }, { include: ['cashier'] });
    // const cashier = await models.Cashier.create({ userId: user.id, code: data.code, firstName: data.firstName, lastName: data.lastName });
    // if (cashier) {
    //   user.cashier = cashier;
    // }
    delete user.dataValues.password;
    return user;
  }

  async find() {
    const users = await models.User.findAll({
      attributes: ['id', 'email', 'role'],
      include: [
        {
          model: models.Cashier,
          as: 'cashier',
          attributes: ['id', 'code', 'firstName', 'lastName'],
        },
      ],
      order: [
        ['id', 'ASC'],
      ]
    });
    return users;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id, {
      include: [
        {
          model: models.Cashier,
          as: 'cashier',
          attributes: ['id', 'code', 'firstName', 'lastName'],
        },
      ],
    });
    if (!user) {
      throw boom.notFound('user not found');
    }
    return user;
  }

  async update(id, changes) {
    let user = await this.findOne(id);
    const { cashier, ...newChanges } = changes;
    await user.update(newChanges);
    await user.cashier.update(cashier);
    user = await this.findOne(id);
    return user;
  }

  async delete(id) {
    const user = await this.findOne(id);
    await user.destroy();
    return { id };
  }

  async findByEmail(email) {
    const user = await models.User.findOne({
      attributes: ['id', 'email', 'role', 'password'],
      where: {
        email,
      },
      include: [
        {
          model: models.Cashier,
          as: 'cashier',
          attributes: ['id', 'code', 'firstName', 'lastName'],
        },
      ],
    });
    return user;
  }
}

module.exports = UsersService;
