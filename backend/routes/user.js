const express = require("express");
const router = express.Router(); 
const userCtrl = require("../controllers/user"); //import du controlleur "user"
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

//import du middleware pour mettre une limite au niveau des tentatives de login échouées
const connexion = require("../middleware/connexion"); 

//import du middleware pour contrôler le mot de passe
const password = require("../middleware/password"); 

//import du middleware pour contrôler les emails
const email = require("../middleware/email");

//import du middleware pour contrôler les champs nom/prénom;
const name = require("../middleware/name");


//---------ROUTES DE CONNEXIONS --------------
router.post("/signup", email, password, name, userCtrl.signup); //créer un compte
router.post("/login", connexion, userCtrl.login); //se connecter sur un compte déjà créé

//---------ROUTES DU PROFIL UTILISATEUR--------------
router.get("/profile/:id", auth, userCtrl.getOneUser); //afficher un profil
router.put("/profile/:id", auth, multer, name, userCtrl.modifyUser); //modifier un profil
router.delete ("/profile/:id", auth, userCtrl.deleteUser); //supprimer un profil

module.exports = router;