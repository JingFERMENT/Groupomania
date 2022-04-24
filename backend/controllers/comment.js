const Comment = require("../models/comment");
const fs = require("fs");

// -----MIDDLEWARE pour créer un commentaire ------------
exports.createComment = (req, res, next) => {

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
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post non trouvée !" });
      }

      const filename = post.imageUrl.split("/images/")[1];
      console.log(filename);

      fs.unlink(`images/${filename}`, () => {
        Post.destroy({ where: { id: req.params.id } })
          .then((user) => res.status(200).json({ message: "Post supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(400).json({ error }));
};
