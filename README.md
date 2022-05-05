# Groupomania
Réseau social interne pour Groupomania, entreprise spécialisée dans la grande distribution (Minimum Viable Product).

## Installation

### 1- Prérequis
```
Pour installer ce projet, vous devez d'abord installer
-Node.js
-MySQL
-Vuejs 3
```

### 2- Cloner le repo du projet
```
Dans votre terminal éxécutez les commandes :
git clone https://github.com/JingZhangFerment/Groupomania
cd Groupomania
```

### 3- La base de données
```
1. Ouvrir la console MySQL et créer un compte ou se connecter si vous en avez déjà un
2- Créer une base de données nommée "groupomania"
3- Importer le fichier "Base_des_données_Groupomania.sql" dans le repo du projet
```

### 4- Installer le backend
```
1. Exécutez la commande => cd backend
2. Installer npm  => npm install
3. Créer un dossier images => mkdir images
4. Créer un fichier .env et y renseigner les variables comme indiqué dans le fichier env.exemple
5. Lancer le serveur backend => npm start ou nodemon server (si nodemon est installé)

```

### 5- Installer le frontend
```
1. Exécutez la commande => cd frontend
2. Installer npm  => npm install
3. Lancer le serveur frontend => npm run serve
```
## Technologies utilisées

Node, Vuejs, SQL (base des données)

## Fonctionnalités

### Authentification

- Inscription (utilisateur/admin), connexion, déconnexion, désinscription, 

### Social

- Partage de publications
- Ajout de commentaires 
- Création d'un profil personnel

### Modération

- Inscription administateur pour créer les comptes admin : http://localhost:8080/signup-admin
- Modérer les contenus (réservé aux administrateurs)
