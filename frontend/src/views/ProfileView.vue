<template>
  <!-- mon profil-->

  <NavBar />
  <section class="card">
    <h1 class="card__title">Mon profil</h1>

    <!--Message d'erreur pour la validation des champs-->
    <p class="errorMessage" v-if="status == 'error_saveUserInfo'">
      Une erreur est survenue !
    </p>
    <p class="successMessage" v-if="status == 'success_saveUserInfo'">
      Profil bien à jour !
    </p>

    <!--Message d'info pour l'administrateur-->
    <p class="successMessage" v-if="status == 'success_transformAdmin'">
      Vous êtes administrateur .
    </p>

    <!--Image profile de l'utilisateur -->
    <img class="photo_default" :src="photoUrl" alt="Image du profil d'un utilisateur" />

    <!--Bouton "ajouter une photo" -->
    <input id="file-upload" type="file" name="image" @change="onFileSelected($event)" />
    
    <!--Formulaire de remplissage profile-->
    <form class="form-row">
      <!--nom & Prenom-->
      <input v-model="prenom" class="form-row__input" type="text" name="prenom" placeholder="Prénom"
        aria-label="Prénom" required/>
      <input v-model="nom" class="form-row__input" type="text" name="nom" placeholder="Nom" aria-label="Nom" required />
    </form>
    <form class="form-row">
      <!--Profession-->
      <input v-model="jobTitle" class="form-row__input" type="text" name="profession" placeholder="Profession"
        aria-label="Profession" />
    </form>
    <div class="form-row">
      <!--Bouton enregistrer-->
      <button @click="saveUserInfo()" class="button">Enregister</button>
      <!--Suppression d'un compte-->
      <div class="card__action--delete" @click="deleteAccount()">
        <font-awesome-icon :icon=faTrashCanIcon />
        <span class="delete_text">Supprimer le compte</span>
      </div>
    </div>
  </section>
</template>

<script>
import photoDefaultUrl from "../assets/avatar_default.png";
import NavBar from '../components/NavBar.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export default {
  name: "ProfileView",

  components: {
    NavBar,
    FontAwesomeIcon,
  },

  data: function () {
    return {
      prenom: "",
      nom: "",
      photoUrl: photoDefaultUrl,
      photoUrlToUpload: "",
      jobTitle: "",
      isAdmin: false,
      status: "",
      faTrashCanIcon: faTrashCan,
    };
  },

  mounted: function () {
    const localStorageData = JSON.parse(localStorage.getItem("data"));
    // pour éviter la faille de sécurité: l'utilisateur ajouter "/profile" sans se connecter
    if (localStorageData === null) {
      this.$router.push("/");
      return;
    }

    //envoyer le token au backend
    const options = {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorageData.token },
    };

    //récupérer les infos du profil
    let userId = localStorageData.userId;
    fetch(`http://localhost:3000/api/auth/profile/${userId}`, options)
      .then((response) => {
        response.json().then((data) => {
          this.prenom = data.firstName;
          this.nom = data.lastName;
          this.jobTitle = data.jobTitle;
          this.isAdmin = data.isAdmin;
          //indiquer l'utilisateur son rôle (s'il est Admin)
          if (data.isAdmin == true) {
            this.status = "success_transformAdmin";
          }
          // dans le cas où il y a une nouvelle image
          if (data.photoUrl != "") {
            this.photoUrl = data.photoUrl;
          }
        });
      })
      .catch((error) => console.log(error));
  },

  methods: {
    //sélectionner un fichier à uploader
    onFileSelected: function (event) {
      this.photoUrlToUpload = event.target.files[0];
    },

    //enregistrer les infos du profil
    saveUserInfo: function () {
      const formData = new FormData();
      formData.append("image", this.photoUrlToUpload);
      formData.append("firstName", this.prenom);
      formData.append("lastName", this.nom);
      formData.append("jobTitle", this.jobTitle);

      const localStorageData = JSON.parse(localStorage.getItem("data"));

      const options = {
        method: "PUT",
        body: formData,
        headers: { Authorization: "Bearer " + localStorageData.token },
      };

      const userId = localStorageData.userId;
      fetch(`http://localhost:3000/api/auth/profile/${userId}`, options)
        .then((response) => {
          if (response.status == 401) {
            this.status = "error_saveUserInfo";
          } else {
            response.json().then((formData) => {
              if (formData.user.photoUrl != "") {
                this.photoUrl = formData.user.photoUrl;
                this.photoUrlToUpload = "";
              }
              this.status = "success_saveUserInfo";
            });
          }
        })
        .catch((error) => console.log(error));
    },

    //supprimer le compte profile
    deleteAccount: function () {
      const localStorageData = JSON.parse(localStorage.getItem("data"));

      const options = {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorageData.token },
      };

      const userId = localStorageData.userId;
      fetch(`http://localhost:3000/api/auth/profile/${userId}`, options)
        .then((response) => {
          if (
            response.status == 400 ||
            response.status == 404 ||
            response.status == 403
          ) {
            this.status = "error_saveUserInfo";
          } else {
            localStorage.clear();
            alert("Votre compte sera supprimé !");
            // après suppression, se diriger vers la page "connect"
            this.$router.push("/");
          }
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>

<style scoped>
.photo_default {
  width: 30%;
  margin-left: auto;
  margin-right: auto;
}

.card__action--delete {
  color: black;
}

.card__action--delete:hover {
  cursor: pointer;
  color: red;
}

.delete_text {
  margin-left: 0.5rem;
}

#file-upload {
  margin: 1rem auto 0 auto;
}
</style>
