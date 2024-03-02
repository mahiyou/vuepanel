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
                        <v-col md="2" sm="3" cols="6" align-self="center" :align="$vuetify.locale.isRtl ? 'left' : 'right'"
                            class="pe-2">
                            <v-img :src="user.meta.avatar || '/pics/default-avatar.jpg'"
                                class="rounded-circle  my-2 data.data-avatar" width="90px" height="90px">
                            </v-img></v-col>
                        <v-col md="4" sm="3" cols="6" align-self="center">
                            <div class="my-auto">
                                <h2>{{ user.name }}</h2>
                                <h4 class="text-secondary">{{ user.type.title }}</h4>
                            </div>
                        </v-col>
                        <v-col sm="6" cols="12"
                            :align="$vuetify.display.xs ? 'center' : $vuetify.locale.isRtl ? 'left' : 'right'"
                            class="btn-col">
                            <v-btn class="user-show-btn" prepend-icon="mdi-login-variant" color="customGreen" width="120px"
                                height="30px">{{ $t("admin.login.as-user") }}</v-btn>
                            <v-btn class="user-show-btn ms-2" prepend-icon="mdi-cancel" color="black" width="120px"
                                height="30px">{{ $t("user.block") }}</v-btn>
                            <v-btn :to="{ name: 'deleteUser' }" class="user-show-btn ms-2" prepend-icon="mdi-delete"
                                color="customRed" width="120px" height="30px">{{ $t("user.delete") }}</v-btn>
                        </v-col>
                    </v-row>
                </v-card>

                <v-row class="mt-1">
                    <v-col md="4" cols="12">
                        <v-card class="pa-4" elevation="1" height="600px">
                            <h3 class="mb-5">{{ $t("user.Info") }}</h3>
                            <v-table class="data-table">
                                <tbody>
                                    <tr v-for="( data, key ) in  userDatas " :key="key">
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
                    <v-col md="8" cols="12" class="ps-0">
                        <v-card class="py-4 px-3 activities-card" elevation="1" height="600px">
                            <h3>{{ $t("user.profile.activities") }}</h3>
                            <v-tabs class="activities-tabs mt-3 mb-3" model-value="tab" color="primary" align-tabs="start">
                                <v-tab :value="1">{{ $t("user.profile.overviews") }}</v-tab>
                            </v-tabs>
                            <v-window>
                                <v-window-item :value="1">
                                    <v-row>
                                        <v-col md="9" cols="6">
                                            <div><v-icon
                                                    :icon="$vuetify.locale.isRtl ? 'mdi-arrow-left' : 'mdi-arrow-right'"
                                                    class="me-1 mb-1"></v-icon>
                                                {{ getNumberfActivities(userActivity.calendar) }} {{
                                                    $t("user.profile.activities.this-year") }}</div>
                                        </v-col>
                                        <v-col md="3" cols="6">
                                            <span class="activity-boxes mx-5">
                                                <v-tooltip :text="$t('tooltip.activities.zero')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-4">
                                                        </div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.20')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-3">
                                                        </div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.30')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-2">
                                                        </div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.40')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box bg-primary-lighten-1">
                                                        </div>
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

                                    <ActivitiesTable :activitiesPerDate="userActivity.calendar"
                                        :first-day-of-week="0" />

                                    <v-divider class="mb-6 mt-3"></v-divider>
                                    <div class="activities-content">
                                        <v-card class="overflow-y-auto py-1" max-height="200">
                                            <v-row v-for="( data, key ) in  userActivity.logs " :key="key"
                                                class="mx-1 ms-5"
                                                :class="$vuetify.locale.isRtl ? 'dashed-border-rtl' : 'dashed-border-ltr'">
                                                <v-col cols="1"
                                                    :class="$vuetify.locale.isRtl ? 'col-position-rtl' : 'col-position-ltr'">
                                                    <span class="pa-1 rounded-pill bg-grey-lighten-3">
                                                        <v-icon :icon="getIcon(data)"
                                                            :color="getActivityColor(data)"></v-icon>
                                                    </span>
                                                </v-col>
                                                <v-col
                                                    :class="$vuetify.locale.isRtl ? 'col-position-rtl' : 'col-position-ltr'"
                                                    cols="7">{{ getActivityContent(data) }}</v-col>
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
    <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate
            color="primary"></v-progress-circular>
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
import ActivitiesTable from '@/components/ActivitiesTable.vue';
import { ILogSummary, IUserActivity } from '@/api/users';
import { getTimeDifference } from '@/utilities';

export default defineComponent({
    setup() {
        return {
            getTimeDifference
        }
    },
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
        getNumberfActivities(activitiesCalendar: Record<string, number>) {
            let sum = 0;
            for (const element of Object.values(activitiesCalendar)) {
                sum = sum + element;
            }
            return sum;
        },
        getIcon(activity: ILogSummary) {
            if (activity.event === "edit-profile" && activity.subject_type === "user") {
                return 'mdi-account-edit-outline'
            }
            if (activity.event === "edit-profile" && activity.subject_type === null) {
                return 'mdi-pencil-outline'
            }
            if (activity.event === "delete-user" && activity.subject_type === "user") {
                return 'mdi-delete-outline'
            }
            if (activity.event === "add-user" && activity.subject_type === "user") {
                return 'mdi-account-plus-outline'
            }
            if (activity.event === "login" && activity.subject_type === null) {
                return 'mdi-login'
            }
            if (activity.event === "reset-password" && activity.subject_type === null) {
                return 'mdi-lock-reset'
            }
            if (activity.event === "logout" && activity.subject_type === null) {
                return 'mdi-logout'
            }

        },
        getActivityColor(activity: ILogSummary) {
            if (activity.event === "edit-profile" || activity.event === "add-user") {
                return 'customGreen'
            }
            if (activity.event === "delete-user" && activity.subject_type === "user" || activity.event === "logout") {
                return 'customRed'
            }
            if (activity.event === "login" || activity.event === "reset-password") {
                return 'primary'
            }
        },
        getActivityContent(activity: ILogSummary) {
            if (activity.event === "edit-profile" && activity.subject_type === "user") {
                return `User ${activity.subject_id} profile edited`
            }
            if (activity.event === "edit-profile" && activity.subject_type === null) {
                return `Profile edited`
            }
            if (activity.event === "delete-user" && activity.subject_type === "user") {
                return `User ${activity.subject_id} deleted`
            }
            if (activity.event === "add-user" && activity.subject_type === "user") {
                return `User ${activity.subject_id} added`
            }
            if (activity.event === "login" && activity.subject_type === null) {
                return 'loged in'
            }
            if (activity.event === "reset-password" && activity.subject_type === null) {
                return 'Password reset'
            }
            if (activity.event === "logout" && activity.subject_type === null) {
                return 'Logged out'
            }
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
            min-width: 10px;
            min-height: 10px;
            display: inline-block;
            margin-right: 1.5px;
        }
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
}</style>