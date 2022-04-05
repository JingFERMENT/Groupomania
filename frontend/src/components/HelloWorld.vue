<template>
  <img id = "logo" alt = "Groupomania logo" src="../assets/logo_Groupomania.png">
  <div class="signupPage">
    <h1>Créer un compte</h1>

    <form
      name="signupForm"
      @submit="doSignupOnBackend"
    >
      <div v-if="errors.length" class="alert alert-danger" role="alert">
        <ul>
          <li v-for="(error) in errors" :key="error.id">{{ error }}</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="lastname">Nom</label>
        <input
          name="lastName"
          type="text"
          class="form-control"
          id="lastname"
          placeholder="Nom"
          v-model="lastName"
        />
      </div>

      <div class="form-group">
        <label for="firstname">Prénom</label>
        <input
          name="firstName"
          type="text"
          class="form-control"
          id="firstname"
          placeholder="Prénom"
          v-model="firstName"
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          name="email"
          type="email"
          class="form-control"
          id="email"
          aria-describedby="emailHelp"
          placeholder="Email"
          v-model="email"
        />
      </div>

      <div class="form-group">
        <label for="exampleInputPassword1">Mot de passe</label>
        <input
          name="password"
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          placeholder="Mot de passe"
          v-model="password"
        />
      </div>

      <button type="submit" class="btn btn-primary">Se connecter</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  data: function() { return {
    errors: []};
  },
  methods: {
    doSignupOnBackend: function (e) {
      e.preventDefault();
      
      if (!(this.email && this.password)) {
        return false;
      }

      const data = {
          'email': this.email,
          'password': this.password,
          'firstName': this.firstName,
          'lastName': this.lastName
        };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      };

      fetch("http://localhost:3000/api/auth/signup", options)
    .then(function (response) {
      console.log(response.json());
      
      if (response.status == 500) {
        alert('Signup rate. Une erreur s est passee.');
      }
    })
    .catch(function (error) {
      console.log(error);
      alert(
        "Le serveur ne répond pas. Si le problème persiste, contactez-nous par email : support@name.com."
      );
    });
    }}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.signupPage {
  
    margin-left: auto;
    margin-right: auto;
    width: 500px;
}

#logo {
  width: 300px;
}

.btn {
 margin: 30px;
}
</style>
