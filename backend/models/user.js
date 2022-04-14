const { Sequelize } = require("sequelize");
const db = require("../config/database");
const Post = require("../models/post");

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
    defaultValue: "http:///localhost:3000/images/avatar.png"
  },

  jobtitle: Sequelize.TEXT,
});

User.hasMany(Post, { foreignKey: "userId" , onDelete: "cascade" });

module.exports = User;
