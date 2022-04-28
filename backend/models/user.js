const { Sequelize } = require("sequelize");
const db = require("../config/sequelize");

const User = db.define("user", {
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },

  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  photoUrl: {
    type: Sequelize.STRING,
    allowNull: true,
    defaultValue: "http://localhost:3000/images/avatar.png"
  },

  jobTitle: {
    type: Sequelize.TEXT,
    allowNull: true,
    defaultValue: "",
  },

  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = User;
