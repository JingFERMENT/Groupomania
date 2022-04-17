<template>
  <div class="card">
    <h1 class="card__title">Mon profil</h1>
    <div class="errorMessage" v-if="status == 'error_saveUserInfo'">
      Une erreur est survenue !
    </div>
    <div class="successMessage" v-if="status == 'success_saveUserInfo'">
      Profile bien à jour !
    </div>
    <img
      class="photo_default"
      :src="photoUrl"
      alt="Image du profil d'un utilisateur"
    />
    <!-- personnalisé le bouton "ajouter une photo" -->
    <label for="file-upload" class="custom-file-upload">
      Ajouter une photo ...
      <input
        id="file-upload"
        type="file"
        name="image"
        @change="onFileSelected($event)"
      />
    </label>
    <div class="form-row">
      <input
        v-model="prenom"
        class="form-row__input"
        type="text"
        placeholder="Prénom"
      />
      <input
        v-model="nom"
        class="form-row__input"
        type="text"
        placeholder="Nom"
      />
    </div>
    <div class="form-row">
      <input
        v-model="jobTitle"
        class="form-row__input"
        type="text"
        placeholder="Profession"
      />
    </div>

    <div class="form-row">
      <button @click="saveUserInfo()" class="button">Enregister</button>
      <span class="card__action--delete" @click="deleteAccount()"
        >Supprimer le compte</span
      >
    </div>
  </div>
</template>

<script>
import photoDefaultUrl from "../assets/avatar.png";

export default {
  name: "ProfileView",
  data: function () {
    return {
      prenom: "",
      nom: "",
      photoUrl: photoDefaultUrl,
      photoUrlToUpload: "",
      jobTitle: "",
      status: "",
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

    let userId = localStorageData.userId;
    fetch(`http://localhost:3000/api/auth/profile/${userId}`, options)
      .then((response) => {
        response.json().then((data) => {
          this.prenom = data.firstName;
          this.nom = data.lastName;
          this.photoUrl = data.photoUrl;
          this.jobTitle = data.jobTitle;
        });
      })
      .catch((error) => console.log(error));
  },

  methods: {
    onFileSelected: function (event) {
      this.photoUrlToUpload = event.target.files[0];
    },

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
              this.photoUrl = formData.user.photoUrl;
              this.photoUrlToUpload = "";
              this.status = "success_saveUserInfo";
            });
          }
        })
        .catch((error) => console.log(error));
    },

    deleteAccount: function () {
      const localStorageData = JSON.parse(localStorage.getItem("data"));

      const options = {
        method: "DELETE",
        headers: { Authorization: "Bearer " + localStorageData.token },
      };

      const userId = localStorageData.userId;
      fetch(`http://localhost:3000/api/auth/profile/${userId}`, options)
        .then((response) => {
          console.log(response);
          if (
            response.status == 400 ||
            response.status == 404 ||
            response.status == 403
          ) {
            this.status = "error_saveUserInfo";
          } else {
            localStorage.clear();
            alert("votre compte a bien été supprimé !");
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
  width: 40%;
  margin-left: auto;
  margin-right: auto;
}

.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
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

.successMessage {
  color: green;
}

.card__action--delete {
  color: red;
  text-decoration: underline;
  font-style: italic;
}

.card__action--delete:hover {
  cursor: pointer;
}

#file-upload {
  display: none;
}
.custom-file-upload {
  background: #2196f3;
  margin-left: auto;
  margin-right: auto;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  margin-top: 15px;
  color: white;
}

.custom-file-upload:hover {
  cursor: pointer;
  background: #1976d2;
}
</style>
