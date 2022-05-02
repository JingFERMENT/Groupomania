const Comment = require("../models/comment");
const User = require("../models/user");

// -----MIDDLEWARE pour créer un commentaire ------------
exports.createComment = (req, res, next) => {
  if (!req.body.postId || !req.body.userId || !req.body.description) {
    res.status(400).json({ message: "Merci de bien vérifier si les champs sont tous remplis !" });
    return;
  }

  Comment.create({
    postId: req.body.postId,
    userId: req.body.userId,
    description: req.body.description,
  })
    .then((comment) =>
      res.status(201).json({ message: "Commentaire ajouté!", comment })
    )
    .catch((error) => res.status(400).json({ error }));
};

// -----MIDDLEWARE pour afficher tous les commentaires ------------
exports.getAllCommentsByPost = (req, res, next) => {
  Comment.findAll({
    where: {
      postId: req.params.postid,
    },
    include: {
      model: User,
      attributes: {
        exclude: ["id", "password", "email", "createdAt", "updatedAt"],
      },
    },
    order: [["createdAt", "DESC"]],
  })
    .then((comment) => res.status(200).json(comment))
    .catch((error) => res.status(404).json({ error }));
};

// -----MIDDLEWARE pour supprimer un commentaire -----------
exports.deleteComment = (req, res, next) => {
  Comment.findOne({ where: { id: req.params.id } })
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({ error: "Commentaire non trouvé !" });
      }

      if (req.auth.userId != comment.userId) {
        return res.status(401).json({ error: "Suppression non autorisée !" });
      }

      Comment.destroy({ where: { id: req.params.id } })
        .then(() =>
          res.status(200).json({ message: "Commentaire supprimé !" })
        )
        .catch((error) => res.status(400).json({ error }));
    })

    .catch((error) => res.status(400).json({ error }));
};
