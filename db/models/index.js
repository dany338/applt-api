const { User, UserSchema } = require('./user.model');
const { Company, CompanySchema} = require('./company.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Company.init(CompanySchema, Company.config(sequelize));

  User.associate(sequelize.models);
  Company.associate(sequelize.models);
}

module.exports = setupModels;
