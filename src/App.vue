<template>
    <v-locale-provider rtl>
        <router-view />
    </v-locale-provider>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "./store/auth";
import { useNotificationStore } from "./store/notification";
import { useAPI } from "./api";

export default defineComponent({
    data() {
        return {
            notificationInternal: undefined as any
        };
    },
    mounted() {
        this.notificationInternal = setInterval(async () => {
            const authStore = useAuthStore();
            if (authStore.user) {
                try {
                    const notification = await useAPI().getNotifications({ user: authStore.user });
                    useNotificationStore().set(notification.notifications);
                } catch {
                    /* empty */
                }
            }
        }, 10000);
    },
    unmounted() {
        if (this.notificationInternal) {
            clearInterval(this.notificationInternal);
        }
    },
});
</script>
