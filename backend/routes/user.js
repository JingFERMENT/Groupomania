const express = require("express"); //pour créer les applis web avec node
const router = express.Router(); // permet de créer du router
const userCtrl = require("../controllers/user"); //import du controlleur "user"
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");

//---------ROUTES DE CONNEXIONS --------------
router.post("/signup", userCtrl.signup); //créer un compte
router.post("/login", userCtrl.login); //se connecter sur un compte déjà créé

//---------ROUTES DE PROFILE UTILISATEUR--------------
router.get("/profile/:id", auth, userCtrl.getOneUser); //afficher un profil
router.post("/profile/:id", auth, userCtrl.modifyUser); //modifier un profil
router.post("/profile/:id/photo", auth, multer, userCtrl.modifyPhoto) //modifer la photo profile
//router.delete ("/profile/:id", multer, userCtrl.deleteUser); //supprimer un profil

module.exports = router;