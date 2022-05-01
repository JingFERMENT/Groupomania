# Groupomania - créer un réseau social d'entreprise

## 1- Prérequis
```
Pour installer ce projet, vous devez d'abord installer
-Node.js
-MySQL
-Vuejs 3
```

## 2- Cloner le repo du projet
```
Dans votre terminal éxécutez les commandes :
git clone https://github.com/JingZhangFerment/Groupomania
cd Groupomania
```

## 3- La base de données
```
1. Ouvrir la console MySQL et créer un compte ou se connecter si vous en avez déjà un
2- Créer une base de données nommée "groupomania"
```

## 4- Installer du Backend
```
1. Exécutez la commande : `cd backend`
2. Installer npm  => *npm install*
3. Créer un dossier images => *mkdir images*
4. Créer un fichier .env et y renseigner les variables d'environnement comme dans le fichier env.exemple
5. Installer sequelize => *npm install --save sequelize*
6. Installer nodemon  => *npm install -g nodemon*
7. Lancer le serveur backend => *nodemon server*
8. Transformer un utilisateur en Administrateur => utiliser le lien http://localhost:8080/admin?key="SECRET_KEY"

```

## 5- Installer du Frontend
```
1. Exécutez la commande : `cd backend`
2. Installer npm  => *npm install*
3. Lancer le serveur frontend => *npm run serve*
```
