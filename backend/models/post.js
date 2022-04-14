const { Sequelize } = require("sequelize");
const db = require("../config/database");
const User = require("../models/user");

const Post = db.define("post", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  imageUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Post;
