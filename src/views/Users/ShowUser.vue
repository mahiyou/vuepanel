<template>
    <div class="show-user" v-if="!loading && !serverError">
        <div class="banner">
            <v-img :src="user.banner || '/pics/defaultBanner.jpg'">
                <div class="bg-overlay"></div>
            </v-img>


        </div>
        <v-container>
            <div class="cards">
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
                                height="30px">Login as user</v-btn>
                            <v-btn class="user-show-btn ms-2" prepend-icon="mdi-cancel" color="customRed" width="120px"
                                height="30px">Block user</v-btn>
                        </v-col>
                    </v-row>
                </v-card>

                <v-row class="mt-1">
                    <v-col cols="4">
                        <v-card class="pa-4" elevation="1">
                            <h3 class="mb-5">User Info</h3>
                            <v-table class="data-table">
                                <tbody>
                                    <tr v-for="(data, key) in userDatas" :key="key">
                                        <td>{{ getTitle(data) }}:</td>
                                        <td class="text-secondary">
                                            <div v-if="data != 'status' && data != 'joiningDate'">{{ user[data] }}</div>
                                            <v-chip v-if="data == 'status'" :color="backgroundOfStatus(user.status)">
                                                {{ user[data] }}
                                            </v-chip>
                                            <v-tooltip v-if="data == 'joiningDate'" :text="user.joiningDate" location="top">
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
                    <v-col cols="8" class="ps-0"><v-card class="py-4 px-12 text-center" elevation="1"></v-card></v-col>
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

export default defineComponent({
    data() {
        return {
            user: {} as IUser,
            serverError: undefined as undefined | IErrorInComponent,
            loading: true,
            userDatas: ["phoneNumber", "email", "joiningDate", "city", "country", "role", "status"]
        }
    },
    methods: {
        getTitle(data: string): string {
            data = data.charAt(0).toUpperCase() + data.slice(1);
            return data.replace(/([A-Z])/g, ' $1')
        },
        backgroundOfStatus(status: Status) {
            console.log(status)
            if (status == Status.ACTIVE) {
                return "green"
            } else if (status == Status.SUSPENDED) {
                return "red"
            }
        },
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

}
</style>