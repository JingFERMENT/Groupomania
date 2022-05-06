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

  //contrôle des validations des champs
  if (!req.body.title || !req.body.userId || !req.body.description) {
    res.status(400).json({
      message: "Merci de bien vérifier si les champs sont tous remplis !",
    });
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
    //trier par la date du plus récent au moins récent
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

      //validation existance post
      if (!post) {
        return res.status(404).json({ error: "Post non trouvé !" });
      }

      //validation des champs
      if (!req.body.title || !req.body.description) {
        res.status(400).json({
          message: "Merci de bien vérifier si les champs sont tous remplis !",
        });
        return;
      }

      User.findOne({ where: { id: req.auth.userId } })
        .then((user) => {
          //vérifier celui qui veut modifier le post est bien l'auteur du post ou l'administrateur
          if (user.isAdmin || req.auth.userId === post.userId) {
            // mettre à jour la base des donnée
            Post.update(
              { ...postObject, id: req.params.id },
              { where: { id: req.params.id } }
            )
              .then((post) =>
                // si l'enregistrement réussi
                Post.findOne({ where: { id: req.params.id } })
                  .then((post) => {
                    // récupérer "post" à jour
                    res
                      .status(200)
                      .json({ message: "Post bien à jour !", post });
                  })
                  .catch((error) => res.status(400).json(error))
              )
              .catch((error) => res.status(400).json(error));
          } else {
            return res.status(401).json({ error: "Modification non autorisée !" });
          }
        })
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

      //vérifier celui qui veut supprimer le post est bien l'auteur du post ou l'administrateur
      User.findOne({ where: { id: req.auth.userId } })
        .then((user) => {
          if (!user.isAdmin && req.auth.userId != post.userId) {
            return res
              .status(401)
              .json({ error: "Suppression non autorisée !" });
          }
        })
        .catch((error) => res.status(400).json({ error }));

      const filename = post.imageUrl.split("/images/")[1];

      // 1er arg: chemin du fichier, 2e arg: la callback=ce qu'il faut faire une fois l'image supprimée
      fs.unlink(`images/${filename}`, () => {
        // on supprime l'utilisateur de la base de donnée en indiquant son id
        Post.destroy({ where: { id: req.params.id } })
          .then((user) => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(400).json({ error }));
};
