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
        photoUrl: req.body.photoUrl,
        jobtitle: req.body.jobtitle,
        password: hash,
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

//------------MOFIFIER LA PHOTO D'UN UTILISATEUR------------
exports.modifyPhoto = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } }).then((user) => {
    const photoUrl = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    User.update(
      { photoUrl: photoUrl, id: req.params.id },
      { where: { id: req.params.id } }
    ).then((user) =>
      User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          res.status(200).json({ message: "Photo mise a jour !", user });
        })
        .catch((error) => res.status(400).json(error))
    );
  });
};

//------------MOFIFIER LE PROFILE D'UN UTILISATEUR------------
exports.modifyUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé !" });
    }

    // Si l'userId de l'utilisateur modifiée est le même que l'userId de l'utilisateur avant modification
    if (req.body.id && req.body.id !== User.id) {
      res.status(401).json({ error: "Modification non autorisée !" });
    }

    User.update(
      { ...req.body, id: req.params.id },
      { where: { id: req.params.id } }
    ).then((user) =>
      User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          res.status(200).json({ message: "Profile bien modifié !", user });
        })
        .catch((error) => res.status(400).json(error))
    );
  });
};

//------------SUPPRIMER LE PROFILE D'UN UTILISATEUR------------
exports.deleteUser = (req, res, next) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User non trouvée !" });
      }

      if (user.userId && user.userId !== req.userId) {
        return res.status(403).json({ error: "Requête non autorisée !" });
      }

      const filename = user.photoUrl.split("/images/")[1];

      // 1er arg: chemin du fichier, 2e arg: la callback=ce qu'il faut faire une fois la photo supprimée
      fs.unlink(`images/${filename}`, () => {
        // on supprime l'utilisateur de la base de donnée en indiquant son id
        User.destroy({ where: { id: req.params.id } })
          .then((user) =>
            res.status(200).json({ message: "Utilisateur supprimée !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })

    .catch((error) => res.status(400).json({ error }));
};
