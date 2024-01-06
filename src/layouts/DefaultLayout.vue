<template>
    <v-layout>
        <Navigation :drawer="drawer" />
        <AppBar @toggleDrawer="toggleDrawer" />
        <v-main>
            <RouterView />
        </v-main>
    </v-layout>
</template>
<script lang="ts">
import Navigation from "./Navigation.vue";
import AppBar from "./AppBar.vue";
export default {
    components: {
        Navigation,
        AppBar
    },
    data: () => ({
        drawer: false,
    }),
    methods: {
        toggleDrawer() {
            this.drawer = !this.drawer;
        }
    }
};
</script>