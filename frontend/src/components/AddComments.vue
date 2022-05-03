<template>
<!-- page : ajouter un commentaire-->

    <section class="bloc__comment">
        <!-- message info-->
        <div class="errorMessage" v-if="status == 'error_comment'">
            Une erreur est survenue !
        </div>
        <div class="errorMessage" v-if="status == 'error_send'">
            Merci de bien renseigner le commentaire !
        </div>
        <div class="successMessage" v-if="status == 'success_comment'">
            Commentaire bien envoyé !
        </div>
        <!-- formulaire de commentaire-->
        <form class="form-row__comment">
            <input v-model="description" class="form-row__input" type="text" placeholder="Un commentaire..."
                name="commentaire" aria-label="commentaire">
            <!-- bouton envoyer commentaire-->
            <font-awesome-icon :icon=faPaperPlaneIcon @click="submitComment()" class="icon__send" title="Envoyer" />
        </form>
    </section>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default {

    name: "AddComments",

    // pour pouvoir passer les propriétaires
    props: {
        postId: Number
    },

    components: {
        FontAwesomeIcon,
    },

    data: function () {
        return {
            description: "",
            status: "",
            userId: "",
            faPaperPlaneIcon: faPaperPlane
        };
    },

    methods: {
        //envoyer les commentaires
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
                    if (response.status == 401 || response.status == 404) {
                        this.status = "error_comment";
                    } else if (response.status == 400) {
                        this.status = "error_send";
                    }
                    else {
                        response.json().then(() => {
                            this.status = "success_comment";
                            window.location.reload();
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
.form-row__comment {
    display: flex;
    justify-content: space-between;
}

.form-row__input {
    padding: 6px;
    font-size: 0.8rem;
}

.icon__send {
    padding: 0.5rem;
    cursor: pointer;
}

.icon__send:hover {
    color: #2196f3;
    background-color: #f2f2f2;
    border-radius: 50%
}

.bloc__comment {
    margin-top: 2rem
}
</style>
