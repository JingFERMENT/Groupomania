const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const { Sequelize } = require("sequelize");
const User = require("../models/user");

//--------------MIDDLEWARE POUR L'INSCRIPTION DES UTILISATEURS----------------
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        photoUrl: req.body.photoUrl,
        jobtitle: req.body.jobtitle,
        password: hash,
      })

        .then((User) =>
          res.status(201).json({ message: "Utilisateur créé et sauvegardé !" })
        )
        .catch((error) =>  {console.log(error);res.status(500).json({ error })});
    })
    .catch((error) =>  {console.log(error);res.status(500).json({ error })});
};

//------------MIDDLEWARE POUR CONNECTER LES UTILISATEURS EXISTANTS------------
exports.login = (req, res, next) => {
  
    //vérifier que l'email entré par l'utilisateur correspond à un utilisateur existant de la base de données
    User.findOne({ 
        where:  { email: req.body.email } })
      .then((user) => {
        if (!user) {
          return res.status(401).json({ message: "Utilisateur non trouvé !" });
        }
        //comparer le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de données
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .json({ message: "Mot de passe incorrect !" });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.SECRET_TOKEN,
                { expiresIn: "24h" }
              ),
            });
          })
          .catch((error) => {console.log(error);res.status(500).json({ error })});
      })
      .catch((error) =>  {console.log(error);res.status(500).json({ error })});
  };