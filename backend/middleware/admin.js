//Ce fichier permet de savoir que la requete est admin

//vérifier si l'email est valide
module.exports = (req, res, next) => {
  req.admin = true;
  next();
};