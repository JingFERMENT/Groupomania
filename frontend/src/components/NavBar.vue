<template>
  <ul class="nav">
    <li class="nav-item">
      <router-link to="/post" class="nav-link">Créer un post</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/posts" title="Liste des posts" class="nav-link">Liste des posts</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/profile" title="Mon compte" class="nav-link">Mon profile</router-link>
    </li>
    <li class="nav-item">
      <router-link to="/logout" title="Mon compte" class="nav-link">Déconnexion</router-link>
    </li>
  </ul>
</template>

<script>
export default {
  name: "NavBar",
  methods: {},
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
