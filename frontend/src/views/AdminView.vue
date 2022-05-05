<template>
  <section class="card">
    <!--Logo-->
    <img id="logo" alt="Logo de l'entreprise Groupomania" src="../assets/logo.png" />

    <h1 class="card__title">Inscription ADMIN</h1>

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
    <p class="errorMessage" v-if="errorStatus == 'error_signUp'">
      Email déjà utilisé
    </p>
    <p class="errorMessage" v-if="errorStatus == 'error_tooManyRequest'">
      Votre compte est bloqué temporairement, veuillez réessayer dans quelques
      minutes.
    </p>

    <!--Champ email -->
    <form class="form-row">
      <input v-model="email" class="form-row__input" type="email" name="email" placeholder="Email" aria-label="Email"
        required />
    </form>
    <!--Champs: prénom & nom -->
    <form class="form-row">
      <input v-model="prenom" class="form-row__input" type="text" name="prenom" placeholder="Prénom" aria-label="Prénom"
        required />
      <input v-model="nom" class="form-row__input" type="text" name="nom" placeholder="Nom" aria-label="Nom" required />
    </form>
    <!--Champ mot de passe -->
    <form class="form-row">
      <input v-model="password" class="form-row__input" type="password" name="mot de passe" placeholder="Mot de passe"
        aria-label="Mot de passe" required />
    </form>

    <!--Bouton signup Admin-->
    <button @click="signUp() && !validEmail" class="button" :class="{
      'button--disabled': !validFields || !validPassword,
    }">
      <span>Créer mon compte ADMIN</span>
    </button>
  </section>
</template>

<script>
export default {
  name: "AdminView",
  data: function () {
    return {
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

      fetch("http://localhost:3000/api/auth/admin-signup", options)
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
