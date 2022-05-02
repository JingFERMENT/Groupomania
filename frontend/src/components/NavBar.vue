<template>
<!-- barre de navigation -->
  <ul class="nav">
    <li class="nav-item">
      <router-link to="/post" title = "créer un post" class="nav-link">Créer un post</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/list" title="Liste des posts" class="nav-link">Liste des posts</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/profile" title="Mon profil" class="nav-link">Mon profil</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/" title="Déconnexion" class="nav-link" @click="logOut">Déconnexion
      </router-link>
    </li>
  </ul>
</template>

<script>

export default {
  name: "NavBar",
  methods: {
    //déconnexion d'un compte
    logOut: function () {
            localStorage.clear();
            alert("Vous êtes maintenant déconnecté(e).");
        }
  },
};

</script>

<style scoped>
.nav {
  justify-content: space-around;
}

.nav-link {
  color: black;
  font-weight: 500;
  font-size: 15px;
}
</style>
