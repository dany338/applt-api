'use strict';

const { USER_TABLE } = require('./../models/user.model');
const { COMPANY_TABLE } = require('./../models/company.model');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      email: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
        unique: true,
      },
      password: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING
      },
      role: {
        allowNull: false,
        type: Sequelize.Sequelize.DataTypes.STRING,
        defaultValue: 'external'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      }
    });
    await queryInterface.createTable(COMPANY_TABLE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.DataTypes.INTEGER
      },
      date: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
        field: 'date_invoice',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'created_at',
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.NOW,
      },
      updatedUser: {
        allowNull: false,
        type: Sequelize.DataTypes.INTEGER,
        field: 'updated_user',
        defaultValue: 1,
      }
    });
  },

  async down (queryInterface) {
    await queryInterface.dropTable(COMPANY_TABLE);
    await queryInterface.dropTable(USER_TABLE);
  }
};
