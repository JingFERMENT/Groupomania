<template>
    <div class="bloc_comment">
        <!-- message d'erreur-->
        <div class="errorMessage" v-if="status == 'error_comment'">
            Une erreur est survenue !
        </div>
        <div class="successMessage" v-if="status == 'success_comment'">
            Commentaire bien envoyé !
        </div>
        <form class="form-row_comment">
            <input v-model="description" class="form-row__input" type="text" placeholder="Un commentaire..."
                name="commentaire">
            <font-awesome-icon :icon=faPaperPlaneIcon @click="submitComment()" class="icon_send" title="Envoyer" />
        </form>
    </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default {

    name: "AddComments",

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
.form-row_comment {
    display: flex;
    justify-content: space-between;
}

.form-row__input {
    padding: 6px;
    border: none;
    border-radius: 8px;
    background: #f2f2f2;
    font-size: 0.8rem;
    flex: 1;
    min-width: 100px;
    color: black;
}

.icon_send {
    padding: 0.5rem;
    cursor: pointer;
}

.icon_send:hover {
    color: #2196f3;
    background-color: #f2f2f2;
    border-radius: 50%
}

.bloc_comment {
    margin-top: 2rem
}
</style>
