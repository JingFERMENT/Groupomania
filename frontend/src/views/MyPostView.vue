<template>
  <!-- créer un post-->
  <NavBar />
  <section class="card">
    <h1 class="card__title">Quoi de neuf ?</h1>

    <!--Message d'erreur lors de création d'un post-->
    <p class="errorMessage" v-if="status == 'error_sendPost'">
      Une erreur est survenue !
    </p>
    <p class="successMessage" v-if="status == 'success_sendPost'">
      Publication réussie !
    </p>

    <!--Title d'un post-->
    <form class="form-row">
      <input v-model="title" class="form-row__input" type="text" name="titre" placeholder="Titre" aria-label="Titre"/>
    </form>

    <!--Description d'un post-->
    <form class="form-row">
      <textarea v-model="description" class="form-row__input" type="text" name="description"
        placeholder="Ecrivez quelques choses ..." aria-label="Description"></textarea>
    </form>

    <!--Image d'un post-->
    <img class="image_post" :src="imageUrl" alt = "image d'un post"/>

    <!--Bouton "ajouter l'image" -->
      <input id="file-upload" type="file" name="imageToUpload" @change="onFileSelected($event)" />

    <!--Bouton "publier le post" -->
    <button @click="sendPost()" class="button" :class="{
      'button--disabled': !validFields,
    }">Publier le post</button>
  </section>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  name: "MyPostView",

  components: {
    NavBar,
  },

  data: function () {
    return {
      userId: "",
      title: "",
      description: "",
      imageUrl: "",
      imageToUpload: "",
      status: ""
    };
  },

  computed: {
    validFields: function () {
      if (
        this.title != "" &&
        this.description != ""
      ) {
        return true;
      } else {
        return false;
      }
    }
  },

  methods: {
    onFileSelected: function (event) {
      this.imageToUpload = event.target.files[0];
      alert("Votre image a bien été uploadée.")

    },

    sendPost: function () {
      const localStorageData = JSON.parse(localStorage.getItem("data"));

      const formData = new FormData();
      formData.append("image", this.imageToUpload);
      formData.append("title", this.title);
      formData.append("description", this.description);
      formData.append("userId", localStorageData.userId);

      const options = {
        method: "POST",
        body: formData,
        headers: { Authorization: "Bearer " + localStorageData.token },
      };

      fetch("http://localhost:3000/api/post/", options)
        .then((response) => {
          if (response.status == 401 || response.status == 400 || response.status == 404) {
            this.status = "error_sendPost";
          } else {
            response.json().then((formData) => {
              this.imageUrl = formData.post.imageUrl,
                this.imageToUpload = "",
                this.status = "success_sendPost";
              this.$router.push("/list")

            });
          }
        })
        .catch((error) => console.log(error));
    },
  }
};
</script>

<style scoped>
.image_post {
  display: none;
}
</style>
