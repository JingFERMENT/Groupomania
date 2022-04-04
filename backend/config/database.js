// CONNEXTION l'API A LA BASE DES DONNEES SQL

const { Sequelize } = require("sequelize");

module.exports = new Sequelize('groupomania', 'root', 'OS_Groupmania!20220415@', {
    host: 'localhost',
    dialect: 'mysql'
  });
