<template>

    <div class="errorMessage" v-if="status == 'error_transformAdmin'">
        Une erreur est survenue !
    </div>
    <div class="successMessage" v-if="status == 'success_transformAdmin'">
        Profil transformé en admin !
    </div>
    <div class="errorMessage" v-if="isAdmin && status != 'success_transformAdmin'">
        Vous êtes déjà Admin !
    </div>
    <button @click="transformAdmin()" class="button" :class="{
        'button--disabled': isAdmin,
    }">Transformer en Admin</button>
</template>

<script>
export default {
    name: "TransformAdminView",
    data: function () {
        return {
            status: "",
            isAdmin: false
        };
    },

    mounted: function () {
            const localStorageData = JSON.parse(localStorage.getItem("data"));

            const options = {
                method: "GET",
                headers: { Authorization: "Bearer " + localStorageData.token },
            };

            let userId = localStorageData.userId;
            fetch(`http://localhost:3000/api/auth/profile/${userId}`, options)
                .then((response) => {
                    response.json().then((data) => {
                        this.isAdmin = data.isAdmin;
                    });
                })
                .catch((error) => console.log(error));
            
            return false;
        },
    methods: {
        transformAdmin: function () {

            const localStorageData = JSON.parse(localStorage.getItem("data"));

            const options = {
                method: "POST",
                headers: { Authorization: "Bearer " + localStorageData.token },
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
</style>
