<template>
  <!--Barre de navigation-->
  <NavBar />
  <div class="card">
    <h1 class="card__title">Dernières publications</h1>

    <!--Message d'erreur pour valider les posts-->
    <div class="errorMessage" v-if="status == 'error_post'">
      Une erreur est survenue !
    </div>
    <div class="successMessage" v-if="status == 'success_delete'">
      Post bien supprimé !
    </div>

    <!--structure pour un post-->
    <div class="card gedf-card" v-for="post in posts" :key="post.id">

      <!--entête du post-->
      <div class="card-header">
        <img class="rounded-circle" alt="photo profile" :src="post.photoUrl">
        {{ post.firstName }} {{ post.lastName }}, {{ post.createdAt }}
      </div>

      <!--corps du post-->
      <div class="card-body">
        <div class="text-muted h7 mb-2">
          {{ post.title }}
          <p class="card-text">{{ post.description }}</p>
          <img v-show="post.imageUrl != ''" class="image_post" :src="post.imageUrl" alt="image du post" />
        </div>

        <!--Modification d'un post: affichage de ce post dans ModifyPostView-->
        <router-link :to="{ name: 'modifyPost', params: { id: post.id } }">
          <font-awesome-icon :icon=faEditIcon v-if="(post.userId === currentUserId) || (this.isAdmin == true)"
            class="button" />
        </router-link>

        <!--Suppression d'un post-->
        <font-awesome-icon :icon=faTrashCanIcon v-if="(post.userId === currentUserId) || (this.isAdmin == true)"
          class="button" @click="deletePost(post.id)" />

        <!--Ajout d'un commentaire-->
        <AddComments :postId="post.id" />
        <!--Affichage de tous les commentaires-->
        <ListOfComments :postId="post.id" :isAdmin="this.isAdmin" />
      </div>
    </div>
    <!--Quand il n'y a pas d'affichage message-->
    <div v-show="noMessage">
      <p class="no-message-text">Pas de publication pour le moment.</p>
    </div>
  </div>
</template>

<script>
//import des différents composants
import NavBar from "../components/NavBar.vue";
import AddComments from "../components/AddComments.vue"
import ListOfComments from "@/components/ListOfComments.vue";
//import des icons FontAwesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons";


export default {
  name: "ListOfPostsView",

  components: {
    NavBar,
    AddComments,
    ListOfComments,
    FontAwesomeIcon,
  },

  data: function () {
    return {
      status: "",
      posts: [],
      currentUserId: "",
      faEditIcon: faEdit,
      faTrashCanIcon: faTrashCan,
      isAdmin: false,
      noMessage: false,
    };
  },

  //le moment durant lequel le composant va être rendu sur la page
  mounted: function () {
    const localStorageData = JSON.parse(localStorage.getItem("data"));
    this.currentUserId = localStorageData.userId
    //pas de token, renvoyer vers la page "connect"
    if (localStorageData === null) {
      this.$router.push("/");
      return;
    }
    //envoyer le token au backend
    const options = {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorageData.token },
    };

    //afficher les posts
    fetch("http://localhost:3000/api/post/", options)
      .then((response) => {
        if (response.status == 401 || response.status == 500) {
          this.status = "error_post";
        } else {
          response.json().then((data) => {
            //dans le cas où il n'y pas de poste
            if (data.length === 0) {
              this.noMessage = true;
            }
            for (let i = 0; i < data.length; i++) {
              this.posts.push({
                id: data[i].id,
                userId: data[i].userId,
                title: data[i].title,
                firstName: data[i].user.firstName,
                lastName: data[i].user.lastName,
                createdAt: data[i].createdAt.slice(0, 10).split('-').reverse().join('/'),
                description: data[i].description,
                imageUrl: data[i].imageUrl,
                photoUrl: data[i].user.photoUrl,
              });
            }
          });
        }
      })
      .catch((error) => console.log(error));

    //Affichage de l'info sur l'administrateur
    const optionsUser = {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorageData.token },
    };

    fetch(`http://localhost:3000/api/auth/profile/${this.currentUserId}`, optionsUser)
      .then((response) => {
        response.json().then((data) => {
          this.isAdmin = data.isAdmin;
        });
      })
      .catch((error) => console.log(error));
  },

  methods: {
    //supprimer d'un post
    deletePost: function (postId) {
      const localStorageData = JSON.parse(localStorage.getItem("data"));

      const options = {
        method: "delete",
        headers: { Authorization: "Bearer " + localStorageData.token },
      };

      fetch(`http://localhost:3000/api/post/${postId}`, options)
        .then((response) => {
          if (response.status == 401 || response.status == 400 || response.status == 404) {
            this.status = "error_post";
          } else {
            console.log(response);
            this.status = "success_delete";
            alert("Votre message a bien été supprimé !")
            window.location.reload();
          }
        })
        .catch((error) => console.log(error));
    },
  }

};
</script>

<style scoped>
.card__title {
  padding: 1rem;
}

.h7 {
  font-size: 1rem;
  color: black;
}

.gedf-card {
  padding: 0rem;
  margin-bottom: 1rem;
}

.card-header {
  font-size: 0.8rem;
}

.card-text {
  margin-top: 1rem;
}

.no-message-text {
  text-align: center;
}

.image_post {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.button {
  font-weight: 500;
  font-size: 12px;
  width: 30%;
  margin: 4px;
  padding: 4px;
  color: #ececec;
  background-color: #8c8c8c;
}

.button:hover {
  background-color: #1976d2;
}

.rounded-circle {
  height: 7vh;
  width: 3rem;
  object-fit: cover;
  margin-right: 1rem;
}

/* pour afficher correctement les sauts de ligne */
.card-text {
  white-space: pre;
}
</style>
