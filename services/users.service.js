const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../libs/sequelize');

class UsersService {
  constructor() {}

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const user = await models.User.create({ ...data, password: hash }, { include: ['companies'] });
    delete user.dataValues.password;
    return user;
  }

  async find() {
    const users = await models.User.findAll({
      attributes: ['id', 'email', 'role', 'firstName', 'lastName'],
      include: [
        {
          model: models.Company,
          as: 'companies',
          attributes: ['id', 'nit', 'name', 'address', 'phone'],
        },
      ],
      order: [
        ['id', 'DESC'],
      ]
    });
    return users;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id, {
      include: [
        {
          model: models.Company,
          as: 'companies',
          attributes: ['id', 'nit', 'name', 'address', 'phone'],
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
    await user.update(changes);
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
      attributes: ['id', 'email', 'role', 'password', 'firstName', 'lastName'],
      where: {
        email,
      },
      include: [
        {
          model: models.Company,
          as: 'companies',
          attributes: ['id', 'nit', 'name', 'address', 'phone'],
        },
      ],
    });
    return user;
  }
}

module.exports = UsersService;
