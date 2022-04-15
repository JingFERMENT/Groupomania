//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");

const Post = require("../models/post");
//const fs = require("fs");

// -----MIDDLEWARE pour créer un post ------------
exports.createPost = (req, res, next) => {
  //gérer le cas où il y a des images
  let imageUrl = "" ;
  if(req.file) {
  imageUrl = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;
 }
// si le userId de post est le même que celui du token de connexion
  if (req.body.userId == req.auth.userId) {
    Post
      .create({
        title: req.body.title,
        userId: req.body.userId,
        description: req.body.description,
        imageUrl: imageUrl,
      })
      .then((Post) => res.status(201).json({ message: "Création enregistrée!" }))
      .catch((error) => res.status(400).json({ error }))
  } else {
    res.status(403).json({ error: "Création non autorisée !" });
  }
 
};

// -----MIDDLEWARE pour afficher un post ------------
