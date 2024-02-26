<template>
    <div class="show-user" v-if="!loading && !serverError && user">
        <div class="banner">
            <v-img :src="user.meta.avatar || '/pics/defaultBanner.jpg'">
                <div class="bg-overlay"></div>
            </v-img>
        </div>
        <v-container>
            <div class="cards mb-5">
                <v-card class="pa-4" elevation="1">
                    <v-row>
                        <v-col cols="2" align-self="center" :align="$vuetify.locale.isRtl ? 'left' : 'right'" class="pe-2">
                            <v-img :src="user.meta.avatar || '/pics/default-avatar.jpg'"
                                class="rounded-circle  my-2 data.data-avatar" width="90px" height="90px">
                            </v-img></v-col>
                        <v-col cols="6" align-self="center">
                            <div class="my-auto">
                                <h2>{{ user.name }}</h2>
                                <h4 class="text-secondary">{{ user.type.title }}</h4>
                            </div>
                        </v-col>
                        <v-col cols="4" :align="$vuetify.locale.isRtl ? 'left' : 'right'" class="btn-col">
                            <v-btn class="user-show-btn" prepend-icon="mdi-login-variant" color="customGreen" width="120px"
                                height="30px">{{ $t("admin.login.as-user") }}</v-btn>
                            <v-btn class="user-show-btn ms-2" prepend-icon="mdi-cancel" color="customRed" width="120px"
                                height="30px">{{ $t("user.block") }}</v-btn>
                        </v-col>
                    </v-row>
                </v-card>

                <v-row class="mt-1">
                    <v-col cols="4">
                        <v-card class="pa-4" elevation="1" height="600px">
                            <h3 class="mb-5">{{ $t("user.Info") }}</h3>
                            <v-table class="data-table">
                                <tbody>
                                    <tr v-for="(data, key) in userDatas" :key="key">
                                        <td>{{ data.tilte }}:</td>
                                        <td class="text-secondary">
                                            <div v-if="data.value !== user.status && data.value !== user.created_at">{{
                                                data.value }}</div>
                                            <v-chip v-if="data.value === user.status"
                                                :color="backgroundOfStatus(user.status)">
                                                {{ $t('user.status.' + data.value) }}
                                            </v-chip>
                                            <v-tooltip v-if="data.value == user.created_at"
                                                :text="`${user.created_at?.toLocaleDateString()}  ${user.created_at?.toLocaleTimeString()}`"
                                                location="top">
                                                <template v-slot:activator="{ props }">
                                                    <div v-bind="props">{{ user.created_at ?
                                                        getTimeDifference(user.created_at) : "-" }}</div>
                                                </template>
                                            </v-tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card>
                    </v-col>
                    <v-col cols="8" class="ps-0">
                        <v-card class="py-4 px-3 activities-card" elevation="1" height="600px">
                            <h3>{{ $t("user.profile.activities") }}</h3>
                            <v-tabs class="activities-tabs mt-3 mb-3" model-value="tab" color="primary" align-tabs="start">
                                <v-tab :value="1">{{ $t("user.profile.overviews") }}</v-tab>
                            </v-tabs>
                            <v-window>
                                <v-window-item :value="1">
                                    <v-row>
                                        <v-col cols="9">
                                            <div><v-icon
                                                    :icon="$vuetify.locale.isRtl ? 'mdi-arrow-left' : 'mdi-arrow-right'"
                                                    class="me-1 mb-1"></v-icon>
                                                {{ getNumberfActivities(userActivity.calendar) }} {{
                                                    $t("user.profile.activities.this-year") }}</div>
                                        </v-col>
                                        <v-col cols="3">
                                            <span class="activity-boxes mx-5">
                                                <v-tooltip :text="$t('tooltip.activities.zero')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-4"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.20')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-3"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.30')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-2"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.40')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-1"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.50')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary"></div>
                                                    </template>
                                                </v-tooltip>
                                            </span>
                                            <v-tooltip :text="$t('tooltip.activities')" location="top">
                                                <template v-slot:activator="{ props }">
                                                    <v-icon v-bind="props" class="mb-1" icon="mdi-menu"></v-icon>
                                                </template>
                                            </v-tooltip>
                                        </v-col>
                                    </v-row>
                                    <v-divider class="mt-2" :thickness="1" />
                                    <v-table class="activities-table">
                                        <ActivitiesTable :activitiesPerDate="userActivity.calendar"
                                            :first-day-of-week="0" />
                                    </v-table>
                                    <v-divider class="mb-6 mt-3"></v-divider>
                                    <div class="activities-content">
                                        <v-card class="overflow-y-auto" max-height="200">
                                            <v-row v-for="(data, key) in userActivity.logs" :key="key" class="mx-1 ms-5"
                                                :class="$vuetify.locale.isRtl ? 'dashed-border-rtl' : 'dashed-border-ltr'">
                                                <v-col cols="1"
                                                    :class="$vuetify.locale.isRtl ? 'col-position-rtl' : 'col-position-ltr'">
                                                    <span class="pa-1 rounded-pill bg-grey-lighten-3"><v-icon
                                                            icon="mdi-ticket-outline" color="customGreen"></v-icon></span>
                                                </v-col>
                                                <v-col
                                                    :class="$vuetify.locale.isRtl ? 'col-position-rtl' : 'col-position-ltr'"
                                                    cols="7"> {{ `user ${data.id} ${data.event}` }}{{ data.subject_id !==
                                                        null
                                                        ? ` user ${data.subject_id}` : "" }}</v-col>
                                                <v-col cols="4" class="text-secondary"
                                                    :align="$vuetify.locale.isRtl ? 'left' : 'right'">{{
                                                        data.created_at.toLocaleDateString() + " " +
                                                        data.created_at.toLocaleTimeString()
                                                    }}</v-col>
                                            </v-row>
                                        </v-card>
                                    </div>
                                </v-window-item>
                            </v-window>
                        </v-card>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </div>
    <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <ErrorAlert class="mx-4" v-if="serverError" :error="serverError" />
</template>
<script lang="ts">
import { useAPI } from '@/api';
import { IUser, UserStatus } from '@/api/authentication';
import BaseError from '@/api/errors/BaseError';
import { IErrorInComponent } from '@/utilities/error';
import { defineComponent } from 'vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import { title } from 'node:process';
import ActivitiesTable from '@/components/ActivitiesTable.vue';
import { IUserActivity } from '@/api/users';

export default defineComponent({
    components: {
        ErrorAlert,
        ActivitiesTable
    },
    data() {
        return {
            user: undefined as IUser | undefined,
            serverError: undefined as undefined | IErrorInComponent,
            loading: true,
            tab: 1,
            activitiesNumber: 1234,
            // activitiesContent: [
            // { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
            // { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
            // { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" },
            // { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
            // { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
            // { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" },
            // { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
            // { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
            // { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" },
            // { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
            // { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
            // { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" }
            // ],
            userActivity: {} as IUserActivity,
        }
    },
    methods: {
        backgroundOfStatus(status: UserStatus) {
            if (status == UserStatus.ACTIVE) {
                return "green"
            } else if (status == UserStatus.SUSPENDED) {
                return "red"
            }
        },
        getTimeDifference(date: Date): string {
            if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30 * 12)) !== 0) {
                return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30 * 12))) + " years ago";
            }
            if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30)) !== 0) {
                return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))) + " monthes ago";
            }
            if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)) !== 0) {
                return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))) + " " + this.$t("user.creat-at.days-ago");
            }
            if (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60)) !== 0) {
                return (Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60))) + " hours ago";
            }
            return 'recently'
        },
        getNumberfActivities(activitiesCalendar: Record<string, number>) {
            let sum = 0;
            for (const element of Object.values(activitiesCalendar)) {
                sum = sum + element;
            }
            return sum;
        }
    },
    computed: {
        userDatas() {
            return [{ tilte: this.$t("user.phone-number"), value: this.user?.meta.cellphone }, { tilte: this.$t("user.email-address"), value: this.user?.meta.email }, { tilte: this.$t("user.joining-date"), value: this.user?.created_at }, { tilte: this.$t("user.city"), value: this.user?.meta.city }, { tilte: this.$t("user.country"), value: this.user?.meta.country }, { tilte: this.$t("user.role"), value: this.user?.type.title }, { tilte: this.$t("user.status"), value: this.user?.status }]
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            async () => {
                this.loading = true;
                try {
                    this.user = await useAPI().getUser(parseInt(this.$route.params.id.toString()));
                    try {
                        this.userActivity = await useAPI().getUserActivity(parseInt(this.$route.params.id.toString()))
                    }
                    catch (e) {
                        if (e instanceof BaseError) {
                            this.serverError = e.toComponentError();
                        } else {
                            this.serverError = {
                                message: this.$t('server error')
                            };
                        }
                    }
                }
                catch (e) {
                    if (e instanceof BaseError) {
                        this.serverError = e.toComponentError();
                    } else {
                        this.serverError = {
                            message: this.$t('server error')
                        };
                    }
                }
                finally {
                    this.loading = false;
                }
            },
            { immediate: true }
        )
    },
})
</script>
<style lang="scss">
.show-user {
    .banner {
        height: 250px;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0px;
        margin: 0px;
    }

    .bg-overlay {
        background: linear-gradient(90deg, #364574, #405189);
        opacity: 0.9;
        height: 250px;
    }

    .cards {
        top: 60px;
        position: relative;
    }

    .user-avatar {
        border: 5px solid rgb(var(--v-theme-secondary), 0.2);
    }

    .user-show-btn {
        font-size: 11px;
    }

    .v-table .v-table__wrapper>table>tbody>tr>td,
    th {
        --v-border-opacity: 0;
        font-size: 12.5px;
    }


    .activities-tabs {
        .v-btn--size-default {
            --v-btn-size: 12px;
            --v-btn-height: 30px;
        }
    }

    .activity-boxes {
        .activity-box {
            width: 10px;
            height: 10px;
            display: inline-block;
            margin-right: 1.5px;
        }
    }

    .activities-table.v-table.v-table--density-default>.v-table__wrapper>table>tbody>tr>td {
        height: 11px;
        width: 11px;
        padding: 0px;
        font-size: 10.7px;
        line-height: 10px;

        th {
            line-height: 10px;
        }
    }

    .v-table>.v-table__wrapper>table {
        border-spacing: 1.2px;
        margin: 20px auto;
        width: fit-content;
    }

    .dashed-border-ltr {
        border-left: 1px dashed rgb(var(--v-theme-secondary));
        z-index: 0;
    }

    .dashed-border-rtl {
        border-right: 1px dashed rgb(var(--v-theme-secondary));
        z-index: 0;
    }

    .col-position-ltr {
        position: relative;
        left: -26px;
        z-index: 2;
    }

    .col-position-rtl {
        position: relative;
        right: -26px;
        z-index: 2;
    }
}
</style>