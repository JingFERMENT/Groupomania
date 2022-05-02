<template>
    <!-- transformer l'utilisateur en administrateur -->

    <section :class="{
        'hidden-div': !isSecure,
    }">
        <!-- message info -->
        <div class="errorMessage" v-if="status == 'error_transformAdmin'">
            Une erreur est survenue !
        </div>
        <div class="successMessage" v-if="status == 'success_transformAdmin'">
            Profil transformé en admin !
        </div>
        <div class="errorMessage" v-if="isAdmin && status != 'success_transformAdmin'">
            Vous êtes déjà Admin !
        </div>

        <!-- bouton transformation -->
        <button @click="transformAdmin()" class="button" :class="{
            'button--disabled': isAdmin,
        }">Transformer en Admin</button>
    </section>
</template>

<script>
export default {
    name: "TransformAdminView",
    data: function () {
        return {
            status: "",
            isAdmin: false,
            isSecure: false,
        };
    },

    mounted: function () {
        //récupérer le status Admin dans le backend 
        const localStorageData = JSON.parse(localStorage.getItem("data"));

        const userOptions = {
            method: "GET",
            headers: { Authorization: "Bearer " + localStorageData.token },
        };

        let userId = localStorageData.userId;
        fetch(`http://localhost:3000/api/auth/profile/${userId}`, userOptions)
            .then((response) => {
                response.json().then((data) => {
                    this.isAdmin = data.isAdmin;
                });
            })
            .catch((error) => console.log(error));
        
        //vérifier la clé de sécurité sur le lien Admin
        const verifyOptions = {
            method: "POST",
            // route.query => requête dans l'URL
            body: JSON.stringify({ key: this.$route.query.key }),
            headers: {
                Authorization: "Bearer " + localStorageData.token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        };

        fetch(`http://localhost:3000/api/auth/verify`, verifyOptions)
            .then((response) => {
                response.json().then((data) => {
                    this.isSecure = data.valid;
                });
            })
            .catch((error) => console.log(error));
        return false;
    },

    methods: {

        //transformer le profil utilisateur en administrateur 
        transformAdmin: function () {
            const localStorageData = JSON.parse(localStorage.getItem("data"));
            const options = {
                method: "POST",
                body: JSON.stringify({ key: this.$route.query.key }),
                headers: {
                    Authorization: "Bearer " + localStorageData.token,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
            };

            let userId = localStorageData.userId
            fetch(`http://localhost:3000/api/auth/admin/${userId}`, options)
                .then((response) => {
                    if (response.status == 401) {
                        this.status = "error_transformAdmin";
                    } else {
                        response.json().then((data) => {
                            this.isAdmin = data.user.isAdmin;
                            this.status = "success_transformAdmin";
                        });
                    }
                })
                .catch((error) => console.log(error));
        },
    },
};
</script>

<style scoped>
.hidden-div {
    display: none;
}
</style>
