const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:sl213ON009@localhost:5432/todo_db', {
  logging: false
});

module.exports = sequelize;