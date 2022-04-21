<template>
  <!-- modifier un post-->
  <div class="card">
    <h1 class="card__title">Modifier le post</h1>
    <div class="errorMessage" v-if="status == 'error_post'">
      Une erreur est survenue !
    </div>
    <div class="successMessage" v-if="status == 'success_post'">
      Mise à jour réussie !
    </div>
    <div class="form-row">
      <input v-model="title" class="form-row__input" type="text" name="title" />
    </div>
    <div class="form-row">
      <textarea v-model="description" class="form-row__input" type="text" name="description"></textarea>
    </div>
    <img v-if="imageUrl != ''" class="image_post" :src="imageUrl" alt="image d'un post" />
    <!-- personnalisé le bouton "ajouter une photo" -->
    <label for="file-upload" class="custom-file-upload">
      Modifier l'image ...
      <input id="file-upload" type="file" name="imageToUpload" @change="onFileSelected($event)" />
    </label>
    <button @click="modifyPost()" class="button" :class="{
      'button--disabled': !validFields,
    }">Modifier le post</button>
  </div>
</template>

<script>

export default {
  name: "ModifyPostView",
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

  mounted: function () {
    const localStorageData = JSON.parse(localStorage.getItem("data"));
    if (localStorageData === null) {
      this.$router.push("/");
      return;
    }

    const options = {
      method: "GET",
      headers: { Authorization: "Bearer " + localStorageData.token },
    };

    let postId = this.$route.params.id
    fetch(`http://localhost:3000/api/post/${postId}`, options)
      .then((response) => {
        //dans le cas des erreurs 
        if (response.status == 401 || response.status == 500) {
          this.status = "error_post";
        } else {
          response.json().then((data) => {
            this.title = data.title,
            this.description = data.description,
            this.imageUrl = data.imageUrl
          });
        }
      })
      .catch((error) => console.log(error));
  },

  methods: {
    onFileSelected: function (event) {
      this.imageToUpload = event.target.files[0];
    },

    modifyPost: function () {
      const localStorageData = JSON.parse(localStorage.getItem("data"));

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
#file-upload {
  display: none;
}

.custom-file-upload {
  border-radius: 8px;
  border: 1px solid grey;
  padding: 6px 12px;
  margin: 8px auto 20px 0px;
}

.custom-file-upload:hover {
  cursor: pointer;
  background: grey;
  color: white;
}

.form-row {
  display: flex;
  margin: 16px 0px;
  gap: 16px;
  flex-wrap: wrap;
}

.form-row__input {
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: #f2f2f2;
  font-weight: 500;
  font-size: 16px;
  flex: 1;
  min-width: 100px;
  color: black;
}

.form-row__input::placeholder {
  color: #aaaaaa;
}

.errorMessage {
  color: red;
}

.successMessage {
  color: green;
}
</style>
