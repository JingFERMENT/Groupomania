const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/comment"); //import du controlleur "commentaire"
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

//---------ROUTES DE COMMENTAIRES-------------

router.post("/", auth, multer, commentCtrl.createComment); //créer un commentaire
router.get("/comments/:postid", auth, commentCtrl.getAllCommentsByPost); //afficher tous commentaires
router.delete("/:id", auth, commentCtrl.deleteComment); //supprimer un commentaire

module.exports = router;