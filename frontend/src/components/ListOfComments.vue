<template>
    <div class="bloc_list_comment">
        <div class="errorMessage" v-if="status == 'error_comment'">
            Une erreur est survenue !
        </div>
        <div class="successMessage" v-if="status == 'success_comment'">
            Commentaire bien supprimé !
        </div>
        <div class="comment_header" v-for="comment in comments" :key="comment.id">
            <p>{{ comment.user.firstName }} {{ comment.user.lastName }},
                {{ comment.createdAt.slice(0, 10).split('-').reverse().join('/')
                }}</p>
            <div class="comment_description">
                <p>{{ comment.description }}</p>
                <font-awesome-icon :icon=faTrashCanIcon v-if="(comment.userId === currentUserId) || (isAdmin == true)"
                    @click="deleteComment(comment.id)" class="icon_delete" title = "Supprimer" />
            </div>
        </div>
    </div>
</template>

<script>

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

export default {
    name: "ListOfComments",
    props: {
        postId: Number,
        isAdmin:Boolean,

    },
    components: {
        FontAwesomeIcon,
    },
    data: function () {
        return {
            faTrashCanIcon: faTrashCan,
            comments: [],
            status: "",
            currentUserId: ""
        };
    },

    mounted: function () {
        const localStorageData = JSON.parse(localStorage.getItem("data"));
        this.currentUserId = localStorageData.userId

        if (localStorageData === null) {
            this.$router.push("/");
            return;
        }

        const options = {
            method: "GET",
            headers: { Authorization: "Bearer " + localStorageData.token },
        };

        let postId = this.postId
        fetch(`http://localhost:3000/api/comment//allcomments/${postId}`, options)
            .then((response) => {
                if (response.status == 401 || response.status == 500) {
                    this.status = "error_comment";
                } else {
                    response.json().then((data) => {
                        this.comments = data;
                    });
                }
            })
            .catch((error) => console.log(error));
    },

    methods: {
        deleteComment: function (commentId) {
            const localStorageData = JSON.parse(localStorage.getItem("data"));

            const options = {
                method: "delete",
                headers: { Authorization: "Bearer " + localStorageData.token },
            };

            fetch(`http://localhost:3000/api/comment/${commentId}`, options)
                .then((response) => {
                    if (response.status == 401 || response.status == 400 || response.status == 404) {
                        this.status = "error_comment";
                    } else {
                        console.log(response);
                        this.status = "success_comment";
                        alert("Votre commentaire a bien été supprimé !")
                        window.location.reload();
                    }
                })
                .catch((error) => console.log(error));

        }
    }
}
</script>

<style scoped>

.bloc_list_comment {
    margin-top:2rem
}


.comment_header {
    color: black;
    font-size: 14px;
}

.comment_description {
    display: flex;
    justify-content: space-between;
}

p {
    overflow: hidden;
    font-size: 0.8rem;
    border-radius: 6px;
}

.icon_delete {
    padding: 0.5rem;
    cursor: pointer;
}

.icon_delete:hover {
    color:red;
    background-color: #f2f2f2;
    border-radius: 50%
}
</style>
