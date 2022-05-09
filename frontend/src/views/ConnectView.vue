<template>
  <section class="card">
    <!--Logo-->
    <img id="logo" alt="Logo de l'entreprise Groupomania" src="../assets/logo.png" />

    <!--Affichage des titres selon 2 modes : login & signup-->
    <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
    <h1 class="card__title" v-else>Inscription</h1>

    <!--Affichage des liens selon 2 modes: login & signup-->
    <p class="card__subtitle" v-if="mode == 'login'">
      Vous n’avez pas de compte ?
      <a @click="switchToSignUp()" class="card__action">Inscrivez-vous</a>
    </p>
    <p class="card__subtitle" v-else>
      Vous avez déjà un compte ?
      <a @click="switchToLogin()" class="card__action">Se connecter</a>
    </p>

    <!--Message d'erreur pour la validation des champs-->
    <p class="errorMessage" v-if="!validEmail">
      Merci de respecter le format email.
    </p>
    <p class="errorMessage" v-if="!validFirstName">
      Votre prénom doit avoir minimum 2 caractères, lettres uniquement.
    </p>
    <p class="errorMessage" v-if="!validLastName">
      Votre nom doit avoir minimum 2 caractères, lettres uniquement.
    </p>
    <p class="errorMessage" v-if="!validPassword">
      Votre mot de passe doit avoir au moins : 8 caractères, 1 majuscule, 1
      minuscule, 1 chiffre et sans espace.
    </p>
    <p class="errorMessage" v-if="mode == 'login' && errorStatus == 'error_login'">
      Email et/ou mot de passe invalide
    </p>
    <p class="errorMessage" v-if="mode == 'signUp' && errorStatus == 'error_signUp'">
      Email déjà utilisé
    </p>
    <p class="errorMessage" v-if="errorStatus == 'error_tooManyRequest'">
      Votre compte est bloqué temporairement, veuillez réessayer dans quelques
      minutes.
    </p>

    <!--Champ Email -->
    <form class="form-row">
      <input v-model="email" class="form-row__input" type="email" name="email" placeholder="Email" aria-label="Email" required/>
    </form>
    <!--Champs uniquement pour signup: prénom & nom -->
    <form class="form-row" v-if="mode == 'signUp'">
      <input v-model.trim="prenom" class="form-row__input" type="text" name="prenom" placeholder="Prénom"
        aria-label="Prénom" required/>
      <input v-model.trim="nom" class="form-row__input" type="text" name="nom" placeholder="Nom" aria-label="Nom" required/>
    </form>
    <!--Champ mot de passe -->
    <form class="form-row">
      <input v-model="password" class="form-row__input" type="password" name="mot de passe" placeholder="Mot de passe"
        aria-label="Mot de passe" required/>
    </form>

    <!--Deux boutons de validations: signup ou login -->
    <div class="form-row">
      <button @click="login()" class="button" :class="{
        'button--disabled': !validFields || !validPassword,
      }" v-if="mode == 'login'">
        <span>Se connecter</span>
        <!--Bouton connexion -->
      </button>
      <button @click="signUp() && !validEmail" class="button" :class="{
        'button--disabled': !validFields || !validPassword,
      }" v-else>
        <span>Créer mon compte</span>
        <!--Bouton signup -->
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "ConnectView",
  data: function () {
    return {
      mode: "login",
      email: "",
      prenom: "",
      nom: "",
      password: "",
      errorStatus: "",
    };
  },

  //Mis en cache et recalculé uniquement si les champs changent
  computed: {
    //vérifier si tous les champs sont bien remplis
    validFields: function () {
      //1er cas: inscription
      if (this.mode == "signUp") {
        if (
          this.email != "" &&
          this.prenom != "" &&
          this.nom != "" &&
          this.password != ""
        ) {
          return true;
        } else {
          return false;
        }
        //2ème cas: connexion
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },

    //Valider le format "email"
    validEmail: function () {
      if (this.email == "") {
        return true;
      }
      const emailRegExp = new RegExp(
        "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
        "g"
      );
      return emailRegExp.test(this.email);
    },

    //Valider le format "prénom"
    validFirstName: function () {
      if (this.prenom == "") {
        return true;
      }

      const firstNameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]{2,}$", "g");
      return firstNameRegExp.test(this.prenom);
    },

    //Valider le format "nom"
    validLastName: function () {
      if (this.nom == "") {
        return true;
      }

      const lastNameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]{2,}$", "g");
      return lastNameRegExp.test(this.nom);
    },

    //Valider le format "mot de passe"
    validPassword: function () {
      if (this.password == "") {
        return true;
      }

      const passwordRegExp = new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=\\S+$).{8,20}$",
        "g"
      );
      return passwordRegExp.test(this.password);
    },
  },

  //le moment durant lequel le composant va être rendu sur la page
  mounted: function () {

    //si l'utilisateur est déjà connecté, aller directement sur la page "list" 
    const localStorageData = JSON.parse(localStorage.getItem("data"));
    if (localStorageData) {
      this.$router.push("/list");
      return;
    }
  },

  //recalculées à chaque appel de rendu de la page
  methods: {
    //basculer vers l'inscription
    switchToSignUp: function () {
      this.mode = "signUp";
    },

    //basculer vers la connexion 
    switchToLogin: function () {
      this.mode = "login";
    },

    //inscription
    signUp: function () {
      const data = {
        email: this.email,
        password: this.password,
        firstName: this.prenom,
        lastName: this.nom,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch("http://localhost:3000/api/auth/signup", options)
        .then((response) => {
          if (response.status == 401 || response.status == 500) {
            this.errorStatus = "error_signUp";//email déjà utilisé
          } else if (response.status == 429) {
            //trop de tentatives de connexions échouées
            this.errorStatus = "error_tooManyRequest";
          } else {
            //basculer vers le login
            this.login();
          }
        })
        .catch((error) => console.log(error));
    },

    //connexion
    login: function () {
      const data = {
        email: this.email,
        password: this.password,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      fetch("http://localhost:3000/api/auth/login", options)
        .then((response) => {
          if (response.status == 401) {
            this.errorStatus = "error_login";//email ou mot de passe invalide
          } else if (response.status == 429) {
            //trop de tentatives de connexions échouées
            this.errorStatus = "error_tooManyRequest";
          } else {
            response.json().then((data) => {
              localStorage.setItem("data", JSON.stringify(data));
              //une fois connecté, aller sur la page "list"
              this.$router.push("/list");
            });
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
#logo {
  margin-left: auto;
  margin-right: auto;
  width: 30%;
}

a {
  text-decoration: underline;
}
</style>
>
