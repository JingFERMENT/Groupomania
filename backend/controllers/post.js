//const bcrypt = require("bcrypt");
//const jwt = require("jsonwebtoken");

const Post = require("../models/post");
const User = require("../models/user");
//const fs = require("fs");

// -----MIDDLEWARE pour créer un post ------------
exports.createPost = (req, res, next) => {
  //gérer le cas où il y a des images
  let imageUrl = "";
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }
  // si le userId de post est le même que celui du token de connexion
  if (req.body.userId == req.auth.userId) {
    Post.create({
      title: req.body.title,
      userId: req.body.userId,
      description: req.body.description,
      imageUrl: imageUrl,
    })
      .then((Post) =>
        res.status(201).json({ message: "Création enregistrée!" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(403).json({ error: "Création non autorisée !" });
  }
};

// -----MIDDLEWARE pour afficher un post ------------
exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: {
      model: User,
      attributes: {
        exclude: ["id", "password", "email", "createdAt", "updatedAt"],
      }
    },
  })
    .then((post) => {
      //si le post n'existe pas 
      if (post === null) {
        return res.status(404).json({ message: "Ce post n'existe pas." });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

// -----MIDDLEWARE pour afficher tous les posts ------------
exports.getAllPosts = (req, res, next) => {
  Post.findAll({
    include: {
      model: User,
      attributes: {
        exclude: ["id", "password", "email", "createdAt", "updatedAt"],
      }
    },
  })
    .then((post) =>res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

// -----MIDDLEWARE pour afficher tous les posts d'un utilisateur------------
exports.getAllPostsbyUser = (req, res, next) => {
  Post.findAll({
    where: { userId: req.params.id },
    include: {
      model: User,
      attributes: {
        exclude: ["id", "password", "email", "createdAt", "updatedAt"],
      }
    },
  })
    .then((post) =>res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

// -----MIDDLEWARE pour modifier un post -----------
exports.modifyPost = (req, res, next) => {

  const messageObject = req.file
    ? {
        ...req.body.message,
        messageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Post.findOne({ where: { id: req.params.id } }).then((post) => {
    if (!post) {
      return res.status(404).json({ error: "Post non trouvé !" });
    }

    if (req.body.userId && req.body.userId !== post.userId) {
      return res.status(401).json({ error: "Modification non autorisée !" });
    }
  
    Post.update(
      { ...messageObject},
      { where: { id: req.params.id } }
    ).then((post) =>
      Post.findOne({ where: { id: req.params.id } })
        .then((post) => {
          res.status(200).json({ message: "Post bien modifié !", post });
        })
        .catch((error) => {res.status(400).json(error)})
    );
  });
};