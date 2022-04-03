const express = require("express"); //pour créer les applis web avec node
const app = express(); //faire appel au module "Express" avec sa fonction

// sécuriser les en-tête http de l'application express
const helmet = require("helmet");

//routes
//const userRoutes = require("./routes/user");

require("./config/db.connexion");

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
    "GET, POST, PUT, DELETE, PATCH, OPINIONS "
  );
  next();
});

//protèger l'appli de certaines vulnerabilités en configurant les en-têtes
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

//----------------------CONFIGURATION DES ROUTES API----------------------------

//enregistrement des routes
//app.use("/api/auth", userRoutes);

module.exports = app;
