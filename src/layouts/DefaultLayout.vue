<template>
    <v-layout>
        <Navigation :drawer="drawer" />
        <AppBar @toggleDrawer="toggleDrawer" @messageSeen="messageSeen" />
        <v-main>
            <RouterView/>
            <v-footer class="bg-light text-secondary py-5" :height="$vuetify.display.xs ? '110px' : '70px'"  width="auto">
                <v-row>
                    <v-col sm="6" cols="12" :class="$vuetify.display.xs ? 'text-center' : $vuetify.locale.isRtl ? 'text-right' : 'text-left'"><span dir="ltr" class="mx-1">&copy;{{ getYear() }}</span>{{ $t("Dade Negar Jey") }}</v-col>
                    <v-col sm="6" cols="12" :class="$vuetify.display.xs ? 'text-center' : $vuetify.locale.isRtl ? 'text-left' : 'text-right'"><span>{{ $t("Design & Develop by Dade Negar") }}</span></v-col>
                </v-row>
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