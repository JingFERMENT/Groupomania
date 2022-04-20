<template>
  <NavBar />
  <div class="card">
    <h1 class="card__title">Dernières publications</h1>
    <div class="errorMessage" v-if="status == 'error_post'">
      Une erreur est survenue !
    </div>
    <div class="card gedf-card" v-for="post in posts" :key="post.id">
      <div class="card-header">{{ post.title }}</div>
      <div class="card-body">
        <div class="text-muted h7 mb-2">
          Créé par {{ post.prenom }} {{ post.nom }}, le {{ post.createdAt }}
        </div>
        <!-- quand il n'y a pas d'image-->
        <img v-show="post.imageUrl != ''" class="image_post" :src="post.imageUrl" alt="image du post" />
        <p class="card-text">{{ post.description }}</p>
      </div>
    </div>
    <!-- quand il n'y a pas de post-->
    <div v-if="noMessage">
      <p class="no-message-text">Pas de publication pour le moment.</p>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";

export default {
  name: "ListOfPostsView",
  components: {
    NavBar,
  },
  data: function () {
    return {
      noMessage: false,
      errorStatus: "",
      posts: [],
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
    this.userId = userId;
    fetch("http://localhost:3000/api/post/", options)
      .then((response) => {
        //dans le cas des erreurs 
        if (response.status == 401 || response.status == 500) {
          this.errorStatus = "error_post";
        } else {
          response.json().then((data) => {
            //dans le cas où il n'y pas de poste
            if (data.length === 0) {
              this.noMessage = true;
            }
            for (let i = 0; i < data.length; i++) {
              this.posts.push({
                titre: data[i].title,
                prenom: data[i].user.firstName,
                nom: data[i].user.lastName,
                createdAt: data[i].createdAt.split("T")[0],
                description: data[i].description,
                imageUrl: data[i].imageUrl,
              });
            }
          });
        }
      })
      .catch((error) => console.log(error));
  },
};
</script>

<style scoped>
body {
  background-color: #eeeeee;
}

.card__title {
  padding: 1rem;
}

.h7 {
  font-size: 0.8rem;
}

.gedf-card {
  padding: 0rem;
  margin-bottom: 1rem;
}

.card-text {
  margin-top: 1rem;
}

.no-message-text {
  text-align: center;
}
</style>
