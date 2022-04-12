<template>
  <div class="card">
    <h1 class="card__title">Mon profil</h1>
    <p class="card__subtitle">Mon photo de profil</p>
    <img
      class="photo_default"
      :src="photoUrl"
      alt="image de profil d'un utilisateur"
    />
    <!-- ajout bonton "choisir une photo" -->
    <input type="file" name="photo_profil" @change="onFileSelected($event)" />
    <div class="form-row">
    <!-- ajout bonton "ajouter une photo" -->
      <button @click="onUpload()" class="button">Ajouter une photo</button>
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
      <button @click="logout()" class="button">Enregister</button>
      <p class="card__subtitle--delete">Supprimer le compte</p>
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
      photoUrlToUpload: '',
      jobtitle: "",
    };
  },

  mounted: function () {
    const localStorageData = JSON.parse(localStorage.getItem("data"));
    const userId = localStorageData.userId;
    fetch(`http://localhost:3000/api/auth/profile/${userId}`)
      .then((response) => {
        response.json().then((data) => {
          this.prenom = data.firstName;
          this.nom = data.lastName;
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

     const options = {
        method: "POST",
        body: formData,
      };

      const localStorageData = JSON.parse(localStorage.getItem("data"));
      const userId = localStorageData.userId;
      fetch(`http://localhost:3000/api/auth/profile/${userId}/photo`, options)
        .then((response) => {
          response.json().then((data) => {
            this.photoUrl = data.user.photoUrl;
            this.photoUrlToUpload = '';
           });
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

.card__subtitle--delete {
  color: red;
  text-decoration: underline;
  font-style: italic;
}
</style>
