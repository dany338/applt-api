const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TABLE } = require('./user.model');

const COMPANY_TABLE = 'companies';

const CompanySchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  userId: {
    allowNull: true,
    type: DataTypes.INTEGER,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  date: {
    allowNull: false,
    type: DataTypes.STRING,
    field: 'date_invoice',
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'updated_at',
    defaultValue: Sequelize.NOW,
  },
  updatedUser: {
    allowNull: false,
    type: DataTypes.INTEGER,
    field: 'updated_user',
    defaultValue: 1,
  }
}

class Company extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: 'user' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COMPANY_TABLE,
      modelName: 'Company',
      timestamps: false
    }
  }
}

module.exports = { COMPANY_TABLE, CompanySchema, Company }
