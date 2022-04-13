const { Sequelize } = require("sequelize");
const db = require("../config/database");
const User = require("./user");

const Post = db.define("post", {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: true,
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

Post.belongsTo(User, { foreignKey: "userId" }, { onDelete: "cascade" });

module.exports = Post;
