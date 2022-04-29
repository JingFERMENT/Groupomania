const Post = require("../models/post");
const User = require("../models/user");
const fs = require("fs");

// -----MIDDLEWARE pour créer un post ------------
exports.createPost = (req, res, next) => {
  //gérer le cas où il y a des images
  let imageUrl = "";
  if (req.file) {
    imageUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;
  }

  if (!req.body.title || !req.body.userId || !req.body.description) {
    res.status(400).json({ message: "Champ vide !" });
    return;
  }

  Post.create({
    title: req.body.title,
    userId: req.body.userId,
    description: req.body.description,
    imageUrl: imageUrl,
  })
    .then((post) =>
      res.status(201).json({ message: "Création enregistrée!", post })
    )
    .catch((error) => res.status(400).json({ error }));
};

// -----MIDDLEWARE pour afficher un post ------------
exports.getOnePost = (req, res, next) => {
  Post.findOne({
    where: { id: req.params.id },
    include: {
      model: User,
      attributes: {
        exclude: ["id", "password", "email", "createdAt", "updatedAt"],
      },
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
      },
    },
    order: [["createdAt", "DESC"]],
  })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(404).json({ error }));
};

// -----MIDDLEWARE pour modifier un post -----------

exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (req.file) {
        const oldFilename = post.imageUrl.split("/images/")[1];
        fs.unlink(`images/${oldFilename}`, (error) => {
          console.log(error);
        });
      }

      if (!post) {
        return res.status(404).json({ error: "Post non trouvé !" });
      }
      //vérifier celui qui veut modifier le post est l'auteur du post
      if (req.auth.userId != post.userId) {
        return res.status(401).json({ error: "Modification non autorisée !" });
      }

      // METTRE A JOUR BASE DE DONNEES
      Post.update(
        { ...postObject, id: req.params.id },
        { where: { id: req.params.id } }
      )
        .then((post) =>
          // SI ENREGISTREMENT REUSSI
          Post.findOne({ where: { id: req.params.id } })
            .then((post) => {
              // RECUPERE POST A JOUR
              res.status(200).json({ message: "Post bien à jour !", post });
            })
            .catch((error) => res.status(400).json(error))
        )
        .catch((error) => res.status(400).json(error));
    })
    .catch((error) => res.status(400).json({ error }));
};

// -----MIDDLEWARE pour supprimer un post -----------
exports.deletePost = (req, res, next) => {
  Post.findOne({ where: { id: req.params.id } })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post non trouvé !" });
      }

      if (req.auth.userId != post.userId) {
        return res.status(401).json({ error: "Suppression non autorisée !" });
      }

      const filename = post.imageUrl.split("/images/")[1];

      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: req.params.id } })
          .then((user) => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(400).json({ error }));
};
