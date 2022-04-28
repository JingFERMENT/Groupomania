<template>
  <div class="card">
    <img id="logo" alt="Logo de l'entreprise Groupomania" src="../assets/logo.png" />
    <h1 class="card__title" v-if="mode == 'login'">Connexion</h1>
    <h1 class="card__title" v-else>Inscription</h1>
    <p class="card__subtitle" v-if="mode == 'login'">
      Vous n’avez pas de compte ?
      <span class="card__action" @click="switchToSignUp()">Inscrivez-vous</span>
    </p>
    <p class="card__subtitle" v-else>
      Vous avez déjà un compte ?
      <span class="card__action" @click="switchToLogin()">Se connecter</span>
    </p>
    <div class="errorMessage" v-if="!validEmail">
      Merci de respecter le format email.
    </div>
    <div class="errorMessage" v-if="mode == 'signUp' && !validFirstName">
      Votre prénom doit avoir minimum 2 caractères, lettres uniquement.
    </div>
    <div class="errorMessage" v-if="!validLastName">
      Votre nom doit avoir minimum 2 caractères, lettres uniquement.
    </div>
    <div class="errorMessage" v-if="!validPassword">
      Votre mot de passe doit avoir au moins : 8 caractères, 1 majuscule, 1
      minuscule, 1 chiffre et sans espace.
    </div>
    <div class="errorMessage" v-if="mode == 'login' && errorStatus == 'error_login'">
      Email et/ou mot de passe invalide
    </div>
    <div class="errorMessage" v-if="mode == 'signUp' && errorStatus == 'error_signUp'">
      Email déjà utilisé
    </div>
    <div class="form-row">
      <input v-model="email" class="form-row__input" type="text" placeholder="Email" />
    </div>
    <div class="form-row" v-if="mode == 'signUp'">
      <input v-model="prenom" class="form-row__input" type="text" placeholder="Prénom" />
      <input v-model="nom" class="form-row__input" type="text" placeholder="Nom" />
    </div>
    <div class="form-row">
      <input v-model="password" class="form-row__input" type="password" placeholder="Mot de passe" />
    </div>
    <div class="form-row">
      <button @click="login()" class="button" :class="{
        'button--disabled': !validFields || !validPassword,
      }" v-if="mode == 'login'">
        <span>Se connecter</span>
      </button>
      <button @click="signUp() && !validEmail" class="button" :class="{
        'button--disabled': !validFields || !validPassword,
      }" v-else>
        <span>Créer mon compte</span>
      </button>
    </div>
  </div>
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
  computed: {
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

    validFirstName: function () {
      if (this.prenom == "") {
        return true;
      }

      const firstNameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]{2,}$", "g");
      return firstNameRegExp.test(this.prenom);
    },

    validLastName: function () {
      if (this.nom == "") {
        return true;
      }

      const lastNameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]{2,}$", "g");
      return lastNameRegExp.test(this.nom);
    },

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

    validFields: function () {
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
      } else {
        if (this.email != "" && this.password != "") {
          return true;
        } else {
          return false;
        }
      }
    },
  },

  mounted: function () {
    //pour se diriger directement vers la page list si c'est déjà connecté
    const localStorageData = JSON.parse(localStorage.getItem("data"));

    console.log(localStorageData);

    if (localStorageData) {
      this.$router.push("/list");
      return;
    }
  },

  methods: {
    switchToSignUp: function () {
      this.mode = "signUp";
    },

    switchToLogin: function () {
      this.mode = "login";
    },

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
            this.errorStatus = "error_login";
          } else {
            response.json().then((data) => {
              localStorage.setItem("data", JSON.stringify(data));
              this.$router.push("/profile");
            });
          }
        })
        .catch((error) => console.log(error));
    },
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
            this.errorStatus = "error_signUp";
          } else {
            this.login();
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

.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
}

.form-row__input::placeholder {
  color: #aaaaaa;
}

.errorMessage {
  color: red;
}
</style>
>
