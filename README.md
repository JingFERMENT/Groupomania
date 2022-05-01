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

## 4- Installation du Backend
```
1. Dans le terminal, se placer dans le dossier /backend/
2. Installer npm en exécutant la commande => *npm install*
3. Créer un dossier images en exécutant la commande => *mkdir images*
4. Créer un fichier .env et y renseigner les variables d'environnement suivantes:
```
PORT = ""
DB_USER = "" (roor ou nom d'utilisateur)
DB_PASSWORD = "" (mot de passe de base de données)
DB_HOST = ""
DB_NAME = "" (ex:groupomania)

#Pour encoder des "token ou key" de connexion sécurisés :
#renseignez une chaine de caratères complexe à la place de "" dans les deux variables suivantes:
SECRET_TOKEN = ""
SECRET_KEY = ""
```
5. Installer nodemon en exécutant la commande => *npm install -g nodemon*
6. Lancer le serveur de développement avec la commande => *nodemon server*
7. Installer sequelize en exécutant la commande => *npm install --save sequelize*
8. Pour transformer un utilisateur en Administrateur 
=> utiliser le lien http://localhost:8080/admin?key="SECRET_KEY"

```

## 5- Instalation du Frontend
```
1. Dans le terminal, se placer dans le dossier /frontend/
2. Installer npm en exécutant la commande => *npm install*
3. Lancer la construction du Frontend avec la commande => *npm run serve*
```
