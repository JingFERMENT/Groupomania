// CONNEXTION l'API A LA BASE DES DONNEES SQL
const db = require("./sequelize");
const User = require ("../models/user");
const Post = require("../models/post");

//CONSTRUCTION DES MODELS
Post.belongsTo(User, { foreignKey: "userId" , onDelete: "cascade" });
User.hasMany(Post, { foreignKey: "userId" , onDelete: "cascade" });

module.exports = db;