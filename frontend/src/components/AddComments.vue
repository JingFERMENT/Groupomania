<template>
    <div class="bloc_comment">
        <!-- message d'erreur-->
        <div class="errorMessage" v-if="status == 'error_comment'">
            Une erreur est survenue !
        </div>
        <div class="successMessage" v-if="status == 'success_comment'">
            Commentaire bien envoyé !
        </div>
        <div class="form-row">
            <textarea v-model="description" class="form-row__input" type="text" placeholder="Ecrivez un commentaire..."
                name="commentaire"></textarea>
                  
          <button @click="submitComment()" class="button">
            Commenter
          </button>
        
        </div>
    </div>
</template>

<script>

export default {

    name: "AddComments",

    props: {
        postId: Number
    },
    data: function () {
        return {
            description: "",
            status: "",
            userId: ""
        };
    },

    methods: {

        submitComment: function () {
            const localStorageData = JSON.parse(localStorage.getItem("data"));
            this.userId = localStorageData.userId

            const data = {
                description: this.description,
                userId: this.userId,
                postId: this.postId,
            };

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorageData.token
                },
                body: JSON.stringify(data),
            };

            fetch("http://localhost:3000/api/comment/", options)
                .then((response) => {
                    if (response.status == 401 || response.status == 400 || response.status == 404) {
                        this.status = "error_comment";
                    } else {
                        response.json().then(() => {
                            this.status = "success_comment";
                            this.$router.push("/list")
                        });
                    }
                })
                .catch((error) => console.log(error));
        },
    },
}
</script>

<style scoped>
.form-row__input {
    padding: 8px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    font-size: 0.8rem;
    flex: 1;
    min-width: 100px;
    color: black;
}

.button {
    font-weight: 500;
    font-size: 12px;
    width: 30%;
    padding: 2px;
    color: #ececec;
    background-color: #8c8c8c;
    margin: 2px;
}
</style>
