<template>
    <v-app-bar flat color="white" border class="appbar">
        <v-app-bar-nav-icon :icon="wideNav ? 'mdi-menu' : 'mdi-arrow-left'" variant="text"
            @click.stop="$emit('toggleDrawer'); wideNav = !wideNav"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <div v-if="authStore.user" class="notifications">
            <span class="notif-number">{{ authStore.user.notifications || 0 }}</span>
            <v-btn variant="text" color="secondary" icon="mdi-bell-outline" class="ml-3"></v-btn>
        </div>

        <v-menu v-if="authStore.user">
            <template v-slot:activator="{ props }">
                <v-btn height="100%" class="pa-0" v-bind="props">
                    <div class="user-info-box">
                        <v-row align="center">
                            <v-col :cols="4" class="pa-0">
                                <v-img width="35px" class="rounded-pill"
                                    :src="authStore.user.avatar || '/pics/default-avatar.jpg'"></v-img>
                            </v-col>
                            <v-col :cols="8" class="pr-0">
                                <div class="text-right username">{{ authStore.user.name || "کاربر" }}</div>
                            </v-col>
                        </v-row>
                    </div>
                </v-btn>
            </template>
            <v-list>
                <div class="px-4 text-secondary">{{ authStore.user.name || 'کاربر' }} عزیز
                    خوش آمدید</div>
                <v-list-item v-for="(item, index) in items" class="pa-0" height="fit-content" :key="index">
                    <v-btn variant="text" width="100%">
                        <v-icon :icon="item.icon" color="secondary" class="ml-2"></v-icon>
                        {{ item.title }}
                    </v-btn>
                </v-list-item>
            </v-list>
        </v-menu>
    </v-app-bar>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/store/auth";

export default defineComponent({
    setup() {
        return { authStore: useAuthStore() };
    },
    data() {
        return {
            wideNav: true,
            items: [
                { title: "حساب کاربری", icon: "mdi-account-circle" },
                { title: "پیام ها", icon: "mdi-message-text-outline" },
                { title: "راهنما", icon: "mdi-lifebuoy" },
                { title: "تنظیمات", icon: "mdi-cog" },
                { title: "خروج از حساب کاربری", icon: "mdi-logout" },
            ],
        };
    }
});

</script>
<style lang="scss">
.appbar {
    padding: 0px auto;

    .user-info-box {
        width: 160px;
        overflow: hidden;
        padding: 20px;
        background-color: #f3f3f9;

        .username {
            white-space: nowrap;
            overflow: hidden !important;
            text-overflow: ellipsis;
        }
    }
    .notifications {
        position: relative;

        .notif-number {
            position: absolute;
            top: -8;

            background-color: #f06548;
            color: white;
            padding: 0px 7px;
            font-size: 10px;
            font-weight: 900;
            justify-content: center;
            border-radius: 50%;
        }
    }
}
</style>