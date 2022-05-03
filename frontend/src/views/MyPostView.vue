<template>
  <!-- créer un post-->
  <NavBar />
  <div class="card">
    <h1 class="card__title">Quoi de neuf ?</h1>

    <!--Message d'erreur lors de création d'un post-->
    <div class="errorMessage" v-if="status == 'error_sendPost'">
      Une erreur est survenue !
    </div>
    <div class="successMessage" v-if="status == 'success_sendPost'">
      Publication réussie !
    </div>

    <!----------------------Formulaire de création d'un post------------------------>

    <!-----Title d'un post----->
    <div class="form-row">
      <input v-model="title" class="form-row__input" type="text" name="titre" placeholder="Titre" aria-label="Titre"/>
    </div>

    <!-----Description d'un post----->
    <div class="form-row">
      <textarea v-model="description" class="form-row__input" type="text" name="description"
        placeholder="Ecrivez quelques choses ..." aria-label="Description"></textarea>
    </div>

    <!-----Image d'un post----->
    <img class="image_post" :src="imageUrl" alt = "image d'un post"/>

    <!--Bouton "ajouter l'image" -->
    <label for="file-upload" class="custom-file-upload">
      Ajouter une image ...
      <input id="file-upload" type="file" name="imageToUpload" @change="onFileSelected($event)" />
    </label>

    <!--Bouton "publier le post" -->
    <button @click="sendPost()" class="button" :class="{
      'button--disabled': !validFields,
    }">Publier le post</button>
  </div>
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
.custom-file-upload {
  margin: 8px auto 20px 0px;
}

.image_post {
  display: none;
}
</style>
