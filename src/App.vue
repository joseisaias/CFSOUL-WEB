<template>
<div>
    <v-app data-app>
        <router-view name="default" />
        <vue-confirm-dialog></vue-confirm-dialog>
    </v-app>
</div>
</template>

<script>
/* eslint-disable */
export default {
    components: {
    },
    computed: {
        currentUser() {
            var user = this.$store.state.auth.user;
            return user;
        },
    },
    methods: {

    },
};
</script>
<style>
</style>
