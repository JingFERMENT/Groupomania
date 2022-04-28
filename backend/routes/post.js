const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post"); //import du controlleur "post"
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

//---------ROUTES DE POSTS-------------

router.post("/", auth, multer, postCtrl.createPost); //créer un post
router.get("/:id", auth, postCtrl.getOnePost); //afficher un post par son id
router.get("/", auth, postCtrl.getAllPosts); //afficher toutes les postes
router.put("/:id", auth, multer, postCtrl.modifyPost); //modifier une post
router.delete("/:id", auth, postCtrl.deletePost); //supprimer un post

module.exports = router;
