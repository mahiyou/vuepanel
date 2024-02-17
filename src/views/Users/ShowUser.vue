<template>
    <div class="show-user" v-if="!loading && !serverError">
        <div class="banner">
            <v-img :src="user.banner || '/pics/defaultBanner.jpg'">
                <div class="bg-overlay"></div>
            </v-img>
        </div>
        <v-container>
            <div class="cards mb-5">
                <v-card class="pa-4" elevation="1">
                    <v-row>
                        <v-col cols="2" align-self="center" :align="$vuetify.locale.isRtl ? 'left' : 'right'" class="pe-2">
                            <v-img :src="user.avatar || '/pics/default-avatar.jpg'" class="rounded-circle  my-2 user-avatar"
                                width="90px" height="90px">
                            </v-img></v-col>
                        <v-col cols="6" align-self="center">
                            <div class="my-auto">
                                <h2>{{ user.name }}</h2>
                                <h4 class="text-secondary">{{ user.role }}</h4>
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
                                            <div v-if="data.value != 'status' && data.value != 'joiningDate'">{{
                                                user[data.value] }}</div>
                                            <v-chip v-if="data.value == 'status'" :color="backgroundOfStatus(user.status)">
                                                {{ $t('user.status.' + user[data.value]) }}
                                            </v-chip>
                                            <v-tooltip v-if="data.value == 'joiningDate'" :text="user.joiningDate"
                                                location="top">
                                                <template v-slot:activator="{ props }">
                                                    <div v-bind="props">{{ user.joiningDate }}</div>
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
                                                {{ activitiesNumber }} {{ $t("user.profile.activities.this-year") }}</div>
                                        </v-col>
                                        <v-col cols="3">
                                            <span class="activity-boxes mx-5">
                                                <v-tooltip :text="$t('tooltip.activities.zero')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box box1"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.20')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box box2"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.30')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box box3"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.40')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box box4"></div>
                                                    </template>
                                                </v-tooltip>
                                                <v-tooltip :text="$t('tooltip.activities.50')" location="top">
                                                    <template v-slot:activator="{ props }">
                                                        <div v-bind="props" class="activity-box box5"></div>
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
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Feb</th>
                                                <th v-for="index in 14" :key="index"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>monday</td>
                                                <td v-for="index in 14" :key="index"></td>
                                            </tr>
                                            <tr></tr>
                                            <tr>
                                                <td>wednesday</td>
                                            </tr>
                                            <tr></tr>
                                            <tr>
                                                <td>Friday</td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                    <v-divider class="mb-6 mt-3"></v-divider>
                                    <div class="activities-content">
                                        <v-card class="overflow-y-auto" max-height="200">
                                            <v-row v-for="(data, key) in activitiesContent" :key="key"
                                                class="mx-1 ms-5 dashed-border">
                                                <v-col cols="1" class="col-position">
                                                    <span class="pa-1 rounded-pill bg-grey-lighten-3"><v-icon
                                                            :icon="data.icon" :color="data.color"></v-icon></span>
                                                </v-col>
                                                <v-col class="col-position" cols="7">{{ data.content }}</v-col>
                                                <v-col cols="4" class="text-secondary"
                                                    :align="$vuetify.locale.isRtl ? 'left' : 'right'">{{ data.date
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
import { IUser, Status } from '@/api/authentication';
import BaseError from '@/api/errors/BaseError';
import { IErrorInComponent } from '@/utilities/error';
import { defineComponent } from 'vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import { title } from 'node:process';

export default defineComponent({
    components: {
        ErrorAlert
    },
    data() {
        return {
            user: {} as IUser,
            serverError: undefined as undefined | IErrorInComponent,
            loading: true,
            tab: 1,
            activitiesNumber: 1234,
            activitiesContent: [
                { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
                { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
                { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" },
                { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
                { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
                { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" },
                { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
                { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
                { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" },
                { content: "Admin1 edited your profile", icon: "mdi-cog-outline", color: "customBlue", date: "2023/12/02 13:33:46" },
                { content: "Created a new ticket #1234", icon: "mdi-ticket-outline", color: "customGreen", date: "2023/12/02 16:33:46" },
                { content: "Admin1 edited your profile", icon: "mdi-cancel", color: "customRed", date: "2024/02/02 19:33:46" }
            ]
        }
    },
    methods: {
        backgroundOfStatus(status: Status) {
            console.log(status)
            if (status == Status.ACTIVE) {
                return "green"
            } else if (status == Status.SUSPENDED) {
                return "red"
            }
        },
    },
    computed: {
        userDatas() {
            return [{ tilte: this.$t("user.phone-number"), value: "phoneNumber" }, { tilte: this.$t("user.email-address"), value: "email" }, { tilte: this.$t("user.joining-date"), value: "joiningDate" }, { tilte: this.$t("user.city"), value: "city" }, { tilte: this.$t("user.country"), value: "country" }, { tilte: this.$t("user.role"), value: "role" }, { tilte: this.$t("user.status"), value: "status" }]
        }
    },
    async mounted() {
        try {
            const response = await useAPI().getUser(parseInt(this.$route.params.id.toString()));
            this.user = response.user;
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
    }
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
        line-height: 10px;
    }

    .v-table--density-default>.v-table__wrapper>table>tbody>tr>td {
        height: calc(var(--v-table-row-height, 45px) + 0px);
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
            background-color: red;
            display: inline-block;
            margin-right: 1.5px;
        }

        .box1 {
            background-color: #ededed;
        }

        .box2 {
            background-color: #acd5f2;
        }

        .box3 {
            background-color: #7fa8c9;
        }

        .box4 {
            background-color: #527ba0;
        }

        .box5 {
            background-color: #254e77;
        }
    }

    .activities-table.v-table {
        font-size: 12px;
    }

    .activities-content {
        // overflow-x: scroll;

    }

    .dashed-border {
        border-left: 1px dashed rgb(var(--v-theme-secondary));
        z-index: 0;
    }

    .col-position {
        position: relative;
        left: -26px;
        z-index: 2;
    }
}
</style>