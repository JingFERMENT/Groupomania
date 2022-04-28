<template>
  <NavBar />
  <div class="card">
    <h1 class="card__title">Dernières publications</h1>
    <!-- message d'erreur-->
    <div class="errorMessage" v-if="status == 'error_post'">
      Une erreur est survenue !
    </div>
    <!-- message prise en compte des suppressions-->
    <div class="successMessage" v-if="status == 'success_delete'">
      Post bien supprimé !
    </div>
    <div class="card gedf-card" v-for="post in posts" :key="post.id">
      <div class="card-header">
        <img class="rounded-circle" alt="photo profile" :src="post.photoUrl">
        {{ post.firstName }} {{ post.lastName }}, {{ post.createdAt }}
      </div>
      <div class="card-body">
        <div class="text-muted h7 mb-2">
          {{ post.title }}
          <p class="card-text">{{ post.description }}</p>
          <img v-show="post.imageUrl != ''" class="image_post" :src="post.imageUrl" alt="image du post" />
        </div>
        <router-link :to="{ name: 'modifyPost', params: { id: post.id } }">
          <font-awesome-icon :icon=faEditIcon v-if="post.userId === currentUserId" class="button" />
        </router-link>
        <font-awesome-icon :icon=faTrashCanIcon v-if="post.userId === currentUserId" class="button"
          @click="deletePost(post.id)" />
        <AddComments :postId=post.id />
        <ListOfComments :postId=post.id />

      </div>
    </div>
    <div v-show="noMessage">
      <p class="no-message-text">Pas de publication pour le moment.</p>
    </div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import AddComments from "../components/AddComments.vue"
import ListOfComments from "@/components/ListOfComments.vue";

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
      noMessage: false,
      status: "",
      posts: [],
      currentUserId: "",
      faEditIcon: faEdit,
      faTrashCanIcon: faTrashCan
    };
  },

  mounted: function () {
    const localStorageData = JSON.parse(localStorage.getItem("data"));
    this.currentUserId = localStorageData.userId
    if (localStorageData === null) {
      this.$router.push("/");
      return;
    }
    //envoyer le token au backend
    const options = {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorageData.token },
    };

    fetch("http://localhost:3000/api/post/", options)
      .then((response) => {
        //dans le cas des erreurs 
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
                photoUrl: data[i].user.photoUrl
              });
            }
          });
        }
      })
      .catch((error) => console.log(error));
  },

  methods: {
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
body {
  background-color: #eeeeee;
}

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
  color: white
}

.rounded-circle {
  height: 7vh;
  width: 3rem;
  object-fit: cover;
  margin-right: 1rem;
}
</style>