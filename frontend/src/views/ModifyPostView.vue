<template>
  <NavBar />
  <!-- modifier un post-->
  <div class="card">
    <h1 class="card__title">Modifier le post</h1>

    <!--Message d'erreur lors de modification d'un post-->
    <div class="errorM
    essage" v-if="status == 'error_post'">
      Une erreur est survenue !
    </div>
    <div class="successMessage" v-if="status == 'success_post'">
      Mise à jour réussie !
    </div>

    <!--------------------------Formulaire de modification------------------------------>
    <div class="form-row">
      <!--Titre de post-->
      <input v-model="title" class="form-row__input" type="text" name="title" />
    </div>
    <div class="form-row">
      <!--Description de post-->
      <textarea v-model="description" class="form-row__input" type="text" name="description"></textarea>
    </div>
    <!--Image de post-->
    <img v-if="imageUrl != ''" class="image_post" :src="imageUrl" alt="image d'un post" />
    <!--Bouton "modifier l'image" -->
    <label for="file-upload" class="custom-file-upload">
      Modifier l'image ...
      <input id="file-upload" type="file" name="imageToUpload" @change="onFileSelected($event)" />
    </label>
    <!--Bouton "enregistrer" -->
    <button @click="modifyPost()" class="button" :class="{
      'button--disabled': !validFields,
    }">Enregistrer</button>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";

export default {
  name: "ModifyPostView",

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
      status: "",
      post: ""
    };
  },

  //Mis en cache et recalculé uniquement si les champs changent
  computed: {
    //vérifier si les champs obligatoires sont bien remplis
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

  //le moment durant lequel le composant va être rendu sur la page
  mounted: function () {
    const localStorageData = JSON.parse(localStorage.getItem("data"));

    //pas de token, renvoyer vers la page "connect"
    if (localStorageData === null) {
      this.$router.push("/");
      return;
    }

    const options = {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorageData.token },
    };

    //afficher le post à modifier
    let postId = this.$route.params.id
    fetch(`http://localhost:3000/api/post/${postId}`, options)
      .then((response) => {
        //dans le cas des erreurs 
        if (response.status == 401 || response.status == 500) {
          this.status = "error_post";
        } else {
          response.json()
            .then((data) => {
              this.title = data.title,
                this.description = data.description,
                this.imageUrl = data.imageUrl
            })
            .catch((error) => console.log(error));
        }
      })
      .catch((error) => console.log(error));
  },

  methods: {
    //sélectionner un fichier à uploader
    onFileSelected: function (event) {
      //console.log(event) => trouver le fichier uploader dans event.target.files
      this.imageToUpload = event.target.files[0];
      alert("Votre image a bien été uploadée.")
    },

    //modifier un post
    modifyPost: function () {
      const localStorageData = JSON.parse(localStorage.getItem("data"));

      //construire et envoyer plus facilement les données avec FormData
      const formData = new FormData();
      formData.append("image", this.imageToUpload);
      formData.append("title", this.title);
      formData.append("description", this.description);

      const options = {
        method: "PUT",
        body: formData,
        headers: { Authorization: "Bearer " + localStorageData.token },
      };

      let postId = this.$route.params.id
      fetch(`http://localhost:3000/api/post/${postId}`, options)
        .then((response) => {
          if (response.status == 401 || response.status == 400 || response.status == 404) {
            this.status = "error_sendPost";
          } else {
            response.json().then((formData) => {
              this.imageUrl = formData.post.imageUrl,
                this.imageToUpload = "",
                this.status = "success_post";
              this.$router.push("/list");
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
</style>
