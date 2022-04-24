const { Sequelize } = require("sequelize");
const db = require("../config/sequelize");

const Comment = db.define("comment", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  description: {
    type: Sequelize.TEXT,
    allowNull: false,
  },

  postId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Comment;
