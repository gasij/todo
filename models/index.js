const sequelize = require('../config/db');
const User = require('./user');
const Todo = require('./todo');

// Определение отношений
User.hasMany(Todo, { foreignKey: 'userId' });
Todo.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Todo
};