<template>
    <v-layout>
        <Navigation :drawer="drawer" />
        <AppBar @toggleDrawer="toggleDrawer" @messageSeen="messageSeen" />
        <v-main>
            <RouterView/>
            <v-footer class="bg-light text-secondary py-5" height="70px"  width="auto" app>
                <span dir="ltr" class="mx-1">&copy;{{ getYear() }}</span>{{ $t("Dade Negar Jey") }}
                <v-spacer></v-spacer>
                <span>{{ $t("Design & Develop by Dade Negar") }}</span>
            </v-footer>
        </v-main>
    </v-layout>
</template>
<script lang="ts">
import Navigation from "./Navigation.vue";
import AppBar from "./AppBar.vue";
import { useAPI } from "@/api";
import { useNotificationStore } from "@/store/notification";
import { useI18n } from 'vue-i18n';

export default {
    components: {
        Navigation,
        AppBar,

    },
    setup() {
        return {
            notificationStore: useNotificationStore(),
            t: useI18n().t,
        };
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
        },
        async messageSeen(id: number) {
            try {
                const response = await useAPI().markNotificationsAsRead({ ids: [id] });
                this.notificationStore.set(response.notifications);
            }
            catch {
                throw new Error;
            }
        },
    },
};
</script>                                                                                                