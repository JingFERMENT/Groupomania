<template>
  <NavBar />
  <!-- modifier un post-->
  <section class="card">
    <h1 class="card__title">Modifier le post</h1>

    <!--Message d'erreur lors de modification d'un post-->
    <p class="errorM
    essage" v-if="status == 'error_post'">
      Une erreur est survenue !
    </p>
    <p class="errorMessage" v-if="status == 'error_emptyPost'">
      Merci de renseigner le titre et la description du post !
    </p>
    <p class="successMessage" v-if="status == 'success_post'">
      Mise à jour réussie !
    </p>

    <form class="form-row">
      <!--Titre de post-->
      <input v-model.trim="title" class="form-row__input" type="text" name="title" required />
    </form>
    <form class="form-row">
      <!--Description de post-->
      <textarea v-model.trim="description" class="form-row__input" type="text" name="description" required></textarea>
    </form>
    <!--Image de post-->
    <img v-if="imageUrl != ''" class="image_post" :src="imageUrl" alt="image d'un post" />
    <!--Bouton "modifier l'image" -->
    <input id="file-upload" type="file" name="imageToUpload" @change="onFileSelected($event)"
      aria-label="choisir une photo" />
    <!--Bouton "enregistrer" -->
    <button @click="modifyPost()" class="button" :class="{
      'button--disabled': !validFields,
    }">Enregistrer</button>
  </section>
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
              //éviter le contournement d'accès
              if (data.userId != localStorageData.userId) {
                this.$router.push("/");
                return;
              }
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
          if (response.status == 401 || response.status == 404) {
            this.status = "error_sendPost";
          } else if (response.status == 400) {
            this.status = "error_emptyPost"
          }
          else {
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
</style>
