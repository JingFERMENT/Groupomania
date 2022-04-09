<template>
  <div class="card">
    <h1 class="card__title">Mon profil</h1>
    <p class="card__subtitle">Editer mon profil</p>
    <img
        class="image_default"
        :src="photoUrl"
        alt="image par défaut d'un utilisateur"
    />
    <div class="form-row">
      <button @click="addProfileImage()" class="button">Ajouter une image</button>
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
      <p class="card__subtitle">Supprimer le compte</p>
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
      jobtitle: "",
    };
  },

  mounted: function () {
    const localStorageData = JSON.parse(localStorage.getItem("data"));
    const userId = localStorageData.userId;
    fetch(`http://localhost:3000/api/auth/profile/${userId}`)
      .then((response) => {
        response.json().then((data) => {
          this.user.prenom = data.firstName;
        });
      })
      .catch(function () {
        alert(
          "Le serveur ne répond pas. Si le problème persiste, contactez-nous par email : support@groupomania.com."
        );
      });
  },
};
</script>

<style scoped>
.image_default {
  width: 40%;
  margin-left:auto;
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

</style>
