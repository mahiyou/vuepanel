<template>
    <v-app-bar flat color="light" border class="appbar">
        <v-app-bar-nav-icon :icon="navIcon" variant="text" @click.stop="onWideNav"></v-app-bar-nav-icon>
        <v-spacer></v-spacer>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn variant="text" color="secondary" rounded="circle" v-bind="props"><span
                        class="fi fi-ir flag" /></v-btn>
            </template>
            <v-list>
                <v-list-item v-for="(language, i) in languages" :key="i" :value="language">
                    <template v-slot:prepend>
                        <span class="fi ml-2 rounded" :class="`fi-${language.value}`" />
                    </template>
                    <v-list-item-title>{{ language.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>

        <v-menu v-if="notificationStore" width="300px">
            <template v-slot:activator="{ props }">
                <div class="notifications">
                    <span class="notification-number" v-if="notificationStore.unreadCount">{{ notificationStore.unreadCount
                    }}</span>
                    <v-btn variant="text" color="secondary" icon="mdi-bell-outline" class="ml-3 px-5"
                        v-bind="props"></v-btn>
                </div>
            </template>
            <v-list lines="two" class="py-0">
                <v-list-item class="bg-primary ">
                    <v-list-item-title class="font-weight-bold">اعلانات</v-list-item-title>
                    <template v-slot:append v-if="notificationStore.unreadCount">
                        <span class="bg-light px-2 rounded-lg">{{ notificationStore.unreadCount }} اعلان جدید</span>
                    </template>
                </v-list-item>

                <v-list-item v-for="(item, index) in notifications" :key="index" :value="item.id" :title="item.title"
                    :subtitle="item.subtitle" @click.stop>
                    <template v-slot:prepend>
                        <v-avatar>
                            <v-img :src="item.avatar"></v-img>
                        </v-avatar>
                    </template>

                    <template v-slot:append="{ isActive }">
                        <v-list-item-action>
                            <v-checkbox-btn :model-value="isActive" />
                        </v-list-item-action>
                    </template>
                </v-list-item>
                <v-btn width="100%" height="80px" variant="text" prepend-icon="mdi-arrow-right-thin all-notifications-btn">
                    نشان دادن همه ی اعلان ها</v-btn>
            </v-list>

        </v-menu>
        <v-menu class="user-info-menu">
            <template v-slot:activator="{ props }">
                <v-btn height="100%" class="pa-0" v-bind="props">
                    <div class="user-info-box">
                        <v-row align="center">
                            <v-col :cols="4" class="pa-0">
                                <v-img width="35px" class="rounded-pill" :src="getUserAvatar"></v-img>
                            </v-col>
                            <v-col :cols="8" class="pr-0">
                                <div class="text-right username">{{ getUsername }}</div>
                            </v-col>
                        </v-row>
                    </div>
                </v-btn>
            </template>
            <v-list :items="items" item-value="value" item-title="title" v-list-subheader="`${getUsername} عزیز خوش آمدید`">
            </v-list>
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
        return {
            authStore: useAuthStore(),
            notificationStore: useNotificationStore()
        };
    },
    data() {
        return {
            wideNav: true,
            items: [
                {
                    title: "حساب کاربری", value: "acount", props: {
                        prependIcon: "mdi-account-circle"
                    }
                },
                { title: "پیام ها", value: "messages", props: { prependIcon: "mdi-message-text-outline" } },
                { title: "راهنما", value: "help", props: { prependIcon: "mdi-lifebuoy" } },
                { title: "تنظیمات", value: "settings", props: { prependIcon: "mdi-cog" } },
                { title: "خروج از حساب کاربری", value: "logout", props: { prependIcon: "mdi-logout" } },
            ],
            languages: [
                { title: "انگلیسی", value: "us" },
                { title: "فارسی", value: "ir" },
                { title: "عربی", value: "sa" }
            ]
        };
    },
    methods: {
        onWideNav() {
            this.$emit("toggleDrawer");
            this.wideNav = !this.wideNav;
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
        }
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
        height: 100%;

        .notification-number {
            position: absolute;
            top: 8px;
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