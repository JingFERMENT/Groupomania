<template>
  <!-- créer un post-->
  <NavBar />
  <div class="card">
    <h1 class="card__title">Quoi de neuf ?</h1>
    <div class="errorMessage" v-if="status =='error_sendPost'">
      Une erreur est survenue !
    </div>
    <div class="successMessage" v-if="status =='success_sendPost'">
      Publication réussie !
    </div>
    <div class="form-row">
      <input v-model="title" class="form-row__input" type="text" name="title" placeholder="Title" />
    </div>
    <div class="form-row">
      <textarea v-model="description" class="form-row__input" type="text" placeholder="Ecrivez quelques choses ..."
        name="description"></textarea>
    </div>
    <img class="image_post" :src="imageToUpload" />
    <!-- personnalisé le bouton "ajouter une photo" -->
    <label for="file-upload" class="custom-file-upload">
      Ajouter une image ...
      <input id="file-upload" type="file" name="imageToUpload" @change="onFileSelected($event)" />
    </label>
    <button @click="sendPost()" class="button">Publier le post</button>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue';

export default {
  name: "PostView",
  components: {
    NavBar,
  },
  data: function () {
    return {
      userId: "",
      title: "",
      description: "",
      imageToUpload: "",
      status: ""
    };
  },

  methods: {
    onFileSelected: function (event) {
      this.imageToUpload = event.target.files[0];
    },

    sendPost: function () {
      const formData = new FormData();
      formData.append("image", this.imageToUpload);
      formData.append("title", this.title);
      formData.append("description", this.description);
      

      const localStorageData = JSON.parse(localStorage.getItem("data"));
      formData.append("userId", localStorageData.userId);

      const options = {
        method: "POST",
        body: formData,
        headers: { Authorization: "Bearer " + localStorageData.token},
      };

      fetch("http://localhost:3000/api/post/", options)
        .then((response) => {
          if (response.status == 401 || response.status == 400 || response.status == 404) {
            this.status = "error_sendPost";
          } else {
            response.json().then(() => {
              this.userId = "",
              this.imageToUpload = "",
              this.description = "",
              this.title = "",
              this.status = "success_sendPost";
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
