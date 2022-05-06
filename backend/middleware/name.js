//Ce fichier permet de vérifier les champs nom/prénom
module.exports = (req, res, next) => {
  try {
    const NameRegExp = /^[a-zA-ZÀ-ÿ ,.'-]{2,}$/;
    const firstNameValue = req.body.firstName;
    const lastNameValue = req.body.lastName;

    //contrôle des validations des champs nom/prénom qui doit avoir minimum 2 caractères, lettres uniquement.
    if (
      NameRegExp.test(firstNameValue) == false ||
      NameRegExp.test(lastNameValue) == false
    ) {
      res.status(400).json({
        message:
          "Votre prénom / nom doit avoir minimum 2 caractères, lettres uniquement",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
