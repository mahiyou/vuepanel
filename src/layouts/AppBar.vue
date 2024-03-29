<template>
    <v-app-bar flat color="light" border class="appbar">
        <v-app-bar-nav-icon :icon="navIcon" variant="text" @click.stop="onWideNav"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn variant="text" color="secondary" width="30px" height="100%" rounded="circle" v-bind="props"><span
                        class="fi flag px-0" :class="`fi-` + getCountryCode(languages, $vuetify.locale.current)" /></v-btn>
            </template>
            <v-list :elevation="3">
                <v-list-item v-for="(language, i) in getOtherLanguages($vuetify.locale.current)" :key="i" :value="language"
                    :to="{ query: $route.query, params: { lang: language.value.substring(0, 2) } }">
                    <template v-slot:append>
                        <span class="fi ms-2 rounded" :class="`fi-${getCountryCode(languages, language.value)}`" />
                    </template>
                    <v-list-item-title>{{ language.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu v-if="notificationStore" width="330px">
            <v-toolbar color="primary" class="px-2 fixed-bar">
                <v-toolbar-title class="font-weight-bold">{{ $t("user.notifications") }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <template v-if="notificationStore.unreadCount">
                    <span class="bg-light px-2 rounded-lg">{{ notificationStore.unreadCount }} {{ $t("user.notifications.new")
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
                <v-btn width="100%" height="80px" variant="text"
                    :append-icon="$vuetify.locale.isRtl ? 'mdi-arrow-left-thin' : 'mdi-arrow-right-thin'">
                    {{ $t("user.notifications.view-all") }}
                </v-btn>
            </v-list>
        </v-menu>
        <v-menu class="user-info-menu">
            <v-toolbar color="primary" class="fixed-bar">
                <v-toolbar-title>{{ getUsername }} {{ $t("welcome") }}</v-toolbar-title>
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
import { getCountryCode } from "@/utilities";
import "/node_modules/flag-icons/css/flag-icons.min.css";

export default defineComponent({
    setup() {
        // const { locale } = useI18n({ useScope: 'global' });
        return {
            authStore: useAuthStore(),
            notificationStore: useNotificationStore(),
            getCountryCode,
        };
    },
    data() {
        return {
            checked: true,
            wideNav: true,
            items: [
                {
                    title: this.$t("user.account"), value: "account", props: {
                        prependIcon: "mdi-account-circle"
                    }
                },
                { title: this.$t("user.messages"), value: "messages", props: { prependIcon: "mdi-message-text-outline" } },
                { title: this.$t("help"), value: "help", props: { prependIcon: "mdi-lifebuoy" } },
                { title: this.$t("settings"), value: "settings", props: { prependIcon: "mdi-cog" } },
                { title: this.$t("user.logout"), value: "logout", props: { prependIcon: "mdi-logout", to: { name: "logout" } } },
            ],
            languages: [
                { title: "English", value: "en_us" },
                { title: "فارسی", value: "fa_ir" },
            ]
        };
    },
    methods: {
        onWideNav() {
            this.$emit("toggleDrawer");
            this.wideNav = !this.wideNav;
        },
        getOtherLanguages(language: string) {
            return this.languages.filter((otherLanguage) => otherLanguage.value.substring(0, 2) !== language)
        }
    },
    computed: {
        navIcon() {
            return this.wideNav ? "mdi-menu" : this.$vuetify.locale.isRtl ? "mdi-arrow-left" : "mdi-arrow-right";

        },
        getUsername() {
            if (this.authStore.user) {
                return this.authStore.user.name ? this.authStore.user.name : "کاربر";
            }
            return "";
        },
        getUserAvatar() {
            if (this.authStore.user) {
                return this.authStore.user.meta.avatar ? this.authStore.user.meta.avatar : "/pics/default-avatar.jpg";
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
            background-color: rgb(var(--v-theme-customRed));
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