<template>
    <v-app-bar flat color="light" border class="appbar">
        <v-app-bar-nav-icon :icon="navIcon" variant="text" @click.stop="onWideNav"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn variant="text" color="secondary" width="30px" height="100%" rounded="circle" v-bind="props"><span class="fi flag px-0" :class="`fi-` + getCountryCode($vuetify.locale.current)" /></v-btn>
            </template>
            <v-list :elevation="3">
                <v-list-item v-for="(language, i) in languages" :key="i" :value="language" @click="changeLanguage(language.value)">
                    <template v-slot:prepend>
                        <span class="fi me-2 rounded" :class="`fi-${getCountryCode(language.value)}`" />
                    </template>
                    <v-list-item-title>{{ language.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu v-if="notificationStore" width="330px">
            <v-toolbar color="primary" class="px-2 fixed-bar">
                <v-toolbar-title class="font-weight-bold">{{ $t("notifications") }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <template v-if="notificationStore.unreadCount">
                    <span class="bg-light px-2 rounded-lg">{{ notificationStore.unreadCount }} {{ $t("new notifications")
                    }}</span>
                </template>
            </v-toolbar>

            <template v-slot:activator="{ props }">
                <div class="notifications me-2">
                    <span class="notification-number" v-if="notificationStore.unreadCount">{{ notificationStore.unreadCount
                    }}</span>
                    <v-btn variant="text" color="secondary" width="65px" height="100%" icon="mdi-bell-outline px-0"
                        class="px-5" v-bind="props"></v-btn>
                </div>
            </template>

            <v-list lines="two" class="py-0" :elevation="3">
                <v-list-item v-for="(item, index) in notifications" :key="index" :value="item.id" :title="item.title"
                    :subtitle="item.subtitle" @click.stop>
                    <template v-slot:prepend>
                        <v-avatar>
                            <v-img :src="item.avatar"></v-img>
                        </v-avatar>
                    </template>

                    <template v-slot:append>
                        <v-list-item-action>
                            <v-checkbox-btn :model-value="item.seen !== undefined" @click="$emit('messageSeen', item.id)" />
                        </v-list-item-action>
                    </template>
                </v-list-item>
                <v-btn width="100%" height="80px" variant="text" append-icon="mdi-arrow-left-thin all-notifications-btn">
                    {{ $t("view all notifications") }}
                </v-btn>
            </v-list>
        </v-menu>
        <v-menu class="user-info-menu">
            <v-toolbar color="primary" class="fixed-bar">
                <v-toolbar-title>{{ getUsername }} {{ $t("welcom") }}</v-toolbar-title>
            </v-toolbar>
            <template v-slot:activator="{ props }">
                <v-btn height="100%" class="pa-0" v-bind="props">
                    <div class="user-info-box">
                        <v-row align="center">
                            <v-col :cols="4" class="pa-0">
                                <v-img width="35px" class="rounded-pill" :src="getUserAvatar"></v-img>
                            </v-col>
                            <v-col :cols="8" class="px-0">
                                <div class="text-start username">{{ getUsername }}</div>
                            </v-col>
                        </v-row>
                    </div>
                </v-btn>
            </template>

            <v-list :items="items" item-value="value" item-title="title"></v-list>
        </v-menu>
    </v-app-bar>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/store/auth";
import { renderNotificationItem, useNotificationStore } from "@/store/notification";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export default defineComponent({
    setup() {
        // const { locale } = useI18n({ useScope: 'global' });
        return {
            authStore: useAuthStore(),
            notificationStore: useNotificationStore(),
        };
    },
    data() {
        return {
            checked: true,
            wideNav: true,
            items: [
                {
                    title: this.$t("account"), value: "acount", props: {
                        prependIcon: "mdi-account-circle"
                    }
                },
                { title: this.$t("messages"), value: "messages", props: { prependIcon: "mdi-message-text-outline" } },
                { title: this.$t("help"), value: "help", props: { prependIcon: "mdi-lifebuoy" } },
                { title: this.$t("settings"), value: "settings", props: { prependIcon: "mdi-cog" } },
                { title: this.$t("logout"), value: "logout", props: { prependIcon: "mdi-logout", to: { name: "logout" } } },
            ],
            languages: [
                { title: this.$t("English"), value: "en_us" },
                { title: this.$t("Farsi"), value: "fa_ir" },
            ]
        };
    },
    methods: {
        onWideNav() {
            this.$emit("toggleDrawer");
            this.wideNav = !this.wideNav;
        },
        changeLanguage(newLang: string): void {
            newLang = newLang.substring(0, 2);
            this.$vuetify.locale.current = newLang;
        },
        getCountryCode(locale: string): string {
            if (locale.length == 5) {
                return locale.substring(3);
            }
            const language = this.languages.find((l) => l.value.substring(0, 2) == locale);
            if (!language) {
                throw new Error();
            }
            return this.getCountryCode(language.value);
        }
    },
    computed: {
        navIcon() {
            return this.wideNav ? "mdi-menu" : "mdi-arrow-left";

        },
        getUsername() {
            if (this.authStore.user) {
                return this.authStore.user.name ? this.authStore.user.name : "کاربر";
            }
            return "";
        },
        getUserAvatar() {
            if (this.authStore.user) {
                return this.authStore.user.avatar ? this.authStore.user.avatar : "/pics/default-avatar.jpg";
            }
            return "";
        },
        notifications() {
            return this.notificationStore.items.map((i) => renderNotificationItem(i));
        },
    }
});

</script>
<style lang="scss">
$menu-content-elevation: 0;

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
        height: 100%;

        .notification-number {
            position: absolute;
            top: 10px;
            right: 6px;
            background-color: #f06548;
            color: white;
            padding: 0px 7px;
            font-size: 10px;
            font-weight: 900;
            justify-content: center;
            border-radius: 50%;
        }
    }

    .flag {
        font-size: 17px;
        border-radius: 5px;
    }
}
</style>