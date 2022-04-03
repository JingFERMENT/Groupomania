const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('groupomania', 'root', 'OS_Groupmania!20220415@', {
    host: 'localhost',
    dialect: 'mysql'
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

 