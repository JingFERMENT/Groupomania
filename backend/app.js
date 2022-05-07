const express = require("express"); //pour créer les applis web avec node
const app = express(); //faire appel au module "Express" avec sa fonction

// sécuriser les en-tête http de l'application express
const helmet = require("helmet");

//donner accès au chemin de fichiers
const path = require("path");

//base des données (DB)
const db = require("./config/database");

// test DB
try {
  db.authenticate();
  console.log('Connecté à la base de données MySQL!');
} catch (error) {
  console.error('Impossible de se connecter, erreur suivante :', error);
}

// middleware global, transforme le corps de la requete en objet javascript utilisable
app.use(express.json());

// middleware pour résoudre problèmes de CORS et permettre l'accès à l'API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//protèger l'appli de certaines vulnerabilités en configurant les en-têtes
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//user routes
const userRoutes = require("./routes/user");

//post routes
const postRoutes = require("./routes/post");

//comment routes
const commentRoutes = require("./routes/comment")

//gérer la ressource "images" de manière statique à chaque fois qu'elle reçoit une requête vers la route /images.
app.use("/images", express.static(path.join(__dirname, "images")));

//enregistrement des routes
app.use("/api/auth", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

module.exports = app;
