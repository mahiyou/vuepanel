<template>
    <v-layout>
        <Navigation :drawer="drawer" />
        <AppBar @toggleDrawer="toggleDrawer" @messageSeen="messageSeen" />
        <v-main>
            <RouterView />
            <v-footer class="footer bg-light text-secondary py-5" app>
                <span>{{ getYear() }}&copy;</span> داده نگار جی
                <v-spacer></v-spacer>
                <span>طراحی و توسعه توسط تیم فنی شرکت داده نگار جی</span>
        </v-footer>
        </v-main>
    </v-layout>
</template>
<script lang="ts">
import Navigation from "./Navigation.vue";
import AppBar from "./AppBar.vue";
import { useAPI } from "@/api";
import { useNotificationStore } from "@/store/notification";

export default {
    components: {
        Navigation,
        AppBar,

    },
    setup() {
        return {
            notificationStore: useNotificationStore()
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
        }
    }
};
</script>                                                                                                  