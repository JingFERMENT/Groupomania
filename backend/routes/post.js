const express = require("express"); //pour créer les applis web avec node
const router = express.Router(); // permet de créer du router

const postCtrl = require("../controllers/post"); //import du controlleur "user"
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

//---------ROUTES DE POSTS-------------

//router.post("/", auth, multer, postCtrl.createPost); //créer un post
//router.put("/:id", auth, multer, postCtrl.modifyPost); //modifier une post
//router.delete("/:id", auth, postCtrl.deletePost);//supprimer un post
//router.get("/:id", auth, postCtrl.getOnePost); //afficher un post par son id
//router.get("/", auth, postCtrl.getAllPosts); //afficher toutes les postes

//module.exports = router;