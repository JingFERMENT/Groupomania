<template>
  <div class="card">
    <h1 class="card__title">Mon profil</h1>
    <div class="errorMessage" v-if="status == 'error_saveUserInfo'">
      Une erreur est survenue !
    </div>
    <div class="succesMessage" v-if="status == 'sucess_saveUserInfo'">
      Enregistrement avec succès !
    </div>
    <div class="succesMessage" v-if="status == 'sucess_addUserPhoto'">
      Photo ajoutée avec succès !
    </div>
    <img
      class="photo_default"
      :src="photoUrl"
      alt="image de profil d'un utilisateur"
    />
    <!-- ajout bonton "choisir une photo" -->
    <input type="file" name="photo_profil" @change="onFileSelected($event)" />
    <div class="form-row">
      <!-- ajout bonton "ajouter une photo" -->
      <button @click="onUpload()" class="button">Modifier la photo</button>
    </div>
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
        v-model="jobtitle"
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
      jobtitle: "",
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
          this.jobtitle = data.jobtitle;
        });
      })
      .catch((error) => console.log(error));
  },

  methods: {
    onFileSelected: function (event) {
      this.photoUrlToUpload = event.target.files[0];
    },

    onUpload: function () {
      const formData = new FormData();
      formData.append("photo_profil", this.photoUrlToUpload);

      const localStorageData = JSON.parse(localStorage.getItem("data"));

      const options = {
        method: "POST",
        body: formData,
        headers: { Authorization: "Bearer " + localStorageData.token },
      };

      const userId = localStorageData.userId;

      fetch(`http://localhost:3000/api/auth/profile/${userId}/photo`, options)
        .then((response) => {
          response.json().then((formData) => {
            this.photoUrl = formData.user.photoUrl;
            this.photoUrlToUpload = "";
            this.status = "sucess_addUserPhoto";
          });
        })
        .catch((error) => console.log(error));
    },

    saveUserInfo: function () {
      const UserInfodata = {
        firstName: this.prenom,
        lastName: this.nom,
        jobtitle: this.jobtitle,
      };

      const localStorageData = JSON.parse(localStorage.getItem("data"));

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorageData.token,
        },
        body: JSON.stringify(UserInfodata),
      };

      const userId = localStorageData.userId;

      fetch(`http://localhost:3000/api/auth/profile/${userId}`, options)
        .then((response) => {
          if (response.status == 401) {
            this.status = "error_saveUserInfo";
          } else {
            this.status = "sucess_saveUserInfo";
            //this.$router.push("/post");
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
            alert("votre compte a bien été supprimé !")
            //this.$router.push("/post");
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

.succesMessage {
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
</style>
