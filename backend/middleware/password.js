//Ce fichier contient la configuration pour sécuriser les mots de passe

//importer le package "password-validator"
const passwordValidator = require("password-validator");

const passwordSchema = new passwordValidator();

passwordSchema
  .is().min(8) // Longueur minimal 8
  .is().max(20) // Longueur maximal 20
  .has().uppercase(1) // au moins une lettre en majuscule
  .has().lowercase(1) // au moins une lettre en minuscule
  .has().digits(1) // au moins un chiffre
  .has().not().spaces() // pas d'espaces

//vérifier si le mot de passe correspond bien au schéma
module.exports = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    return res.status(400).json({
      message:
        "Mot de passe non valide: entre 8 et 20 caractères, au moins une majuscule, une minuscule, un chiffre et sans espace !",
    });
  } else {
      next();
  }
};