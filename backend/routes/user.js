const express = require("express"); //pour créer les applis web avec node
const router = express.Router(); // permet de créer du router
const userCtrl = require("../controllers/user"); //import du controlleur "user"


//---------ROUTES DE CONNEXIONS --------------
router.post ("/signup", userCtrl.signup); //créer un compte
router.post ("/login", userCtrl.login); //se connecter sur un compte déjà créé

// ----------EXPORT------------------
module.exports = router; //exporter ce module "router" pour le réutiliser ailleurs