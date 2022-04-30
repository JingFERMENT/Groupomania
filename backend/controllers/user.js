const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const fs = require("fs");

//--------------INSCRIPTION DES UTILISATEURS----------------
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
        isAdmin: false,
      })

        .then((User) =>
          res.status(201).json({ message: "Utilisateur créé et sauvegardé !" })
        )
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

//------------CONNECTER LES UTILISATEURS EXISTANTS------------
exports.login = (req, res, next) => {
  //vérifier que l'email entré par l'utilisateur correspond à un utilisateur existant de la base de données
  User.findOne({
    where: { email: req.body.email },
  })
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
            userId: user.id,
            token: jwt.sign({ userId: user.id }, process.env.SECRET_TOKEN, {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};

//------------AFFICHER LE PROFILE D'UN UTILISATEUR------------
exports.getOneUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(404).json({ error }));
};

//------------MODIFIER LE PROFILE D'UN UTILISATEUR------------
exports.modifyUser = (req, res, next) => {
  const userObject = req.file
    ? {
        ...req.body,
        photoUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if ((user.photoUrl != "http://localhost:3000/images/avatar.png") && req.file) {
        const oldFilename = user.photoUrl.split("/images/")[1];
        fs.unlink(`images/${oldFilename}`, (error) => {
          console.log(error);
        });
      }
    })
    .catch((error) => { return res.status(400).json({ error })});

  // METTRE A JOUR BASE DE DONNEES
  User.update(
    { ...userObject, id: req.params.id },
    { where: { id: req.params.id } }
  ).then((user) =>
    // SI ENREGISTREMENT REUSSI
    User.findOne({ where: { id: req.params.id } })
      .then((user) => {
        // RECUPERE USER A JOUR
        res.status(200).json({ message: "Profil bien à jour !", user });
      })
      .catch((error) => res.status(400).json(error))
  );
};

//------------SUPPRIMER LE PROFILE D'UN UTILISATEUR------------
exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé !" });
      }

      const filename = user.photoUrl.split("/images/")[1];

      // 1er arg: chemin du fichier, 2e arg: la callback=ce qu'il faut faire une fois la photo supprimée
      fs.unlink(`images/${filename}`, () => {
        // on supprime l'utilisateur de la base de donnée en indiquant son id
        User.destroy({ where: { id: req.params.id } })
          .then((user) =>
            res.status(200).json({ message: "Utilisateur supprimé !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    
    .catch((error) => res.status(400).json({ error }));
};

//------------TRANSFORMER L'UTILISATEUR EN ADMINSTRATEUR------------
exports.transformInAdmin = (req, res, next) => {

// METTRE A JOUR BASE DE DONNEES
User.update(
  { isAdmin: true },
  { where: { id: req.params.id } }
).then((user) =>
  // SI ENREGISTREMENT REUSSI
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      // RECUPERE USER A JOUR
      res.status(200).json({ message: "Profil transformé en admin !", user });
    })
    .catch((error) => res.status(400).json(error))
);
};
