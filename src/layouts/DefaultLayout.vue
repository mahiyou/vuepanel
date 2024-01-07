<template>
    <v-layout>
        <Navigation :drawer="drawer" />
        <AppBar @toggleDrawer="toggleDrawer" />
        <v-main>
            <RouterView />
        </v-main>
        <DefaultFooter />
    </v-layout>
</template>
<script lang="ts">
import Navigation from "./Navigation.vue";
import AppBar from "./AppBar.vue";
import DefaultFooter from "./DefaultFooter.vue";

export default {
    components: {
        Navigation,
        AppBar,
        DefaultFooter,
        
    },
    data: () => ({
        drawer: false,
    }),
    methods: {
        toggleDrawer() {
            this.drawer = !this.drawer;
        },
        getYear() {
            const date = new Date();
            return date.getFullYear();
        }
    }
};
</script>                                                                                                       