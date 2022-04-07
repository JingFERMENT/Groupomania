<template>
  <div class="card">
    <h1 class="card__title">Mon profil</h1>
    <p class="card__subtitle">Editer mon profil</p>
    <p>{{ user.prenom }} {{ user.nom }} {{ user.email }}</p>
    <img :src="user.photo" />
    <div class="form-row">
      <button @click="logout()" class="button">Déconnexion</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileView",
  data: function () {
    return { user: {
      email: "",
      prenom: "Jing",
      nom: "",
      photo: "",
      jobTitle: "",}
    };
  },
  /*mounted: function () {
    
  }*/
};
</script>

<style scoped></style>

