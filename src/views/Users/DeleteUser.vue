<template>
    <div class="delete-user" v-if="!loading && !serverError && user">
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
                            <v-btn class="user-show-btn mx-1 mb-2" prepend-icon="mdi-login-variant" color="customGreen" width="120px"
                                height="30px">{{ $t("admin.login.as-user") }}</v-btn>
                            <v-btn class="user-show-btn mb-2 mx-1" prepend-icon="mdi-cancel" color="black" width="120px"
                                height="30px">{{ $t("user.block") }}</v-btn>
                            <v-btn :to="{ name: 'deleteUser' }" class="user-show-btn mb-2 mx-1" prepend-icon="mdi-delete-outline"
                                color="customRed" width="120px" height="30px">{{ $t("user.delete") }}</v-btn>
                        </v-col>
                    </v-row>
                </v-card>

                <v-row class="mt-1">
                    <v-col md="4" cols="12">
                        <v-card class="pa-4" elevation="1" max-height="600px">
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
                    <v-col md="8" cols="12" class="ps-md-0 ps-3">
                        <v-card class="pa-sm-10 pa-6" elevation="1" max-height="600px">
                            <h4><v-icon icon="mdi-alert-outline" color="customRed" class="me-2 mb-1"></v-icon>{{
                                $t('user.delete.alert') }}</h4>
                            <div class="mt-2">{{ $t('user.delete.alert.all-data-will-be-deleted') }}</div>
                            <div class="mt-8 text-secondary">{{ $t('user.delete.confirm') }} "{{ user.id }}":</div>
                            <v-row class="mt-1">
                                <v-col sm="5" cols="12"> <v-text-field variant="outlined" v-model="inputedUserID"
                                        :dir="$vuetify.locale.current" />
                                </v-col>
                                <v-col sm="3" cols="7">
                                    <v-btn class="user-show-btn" prepend-icon="mdi-delete-outline" color="customRed"
                                        width="100%" :loading="loadingDelete" :disabled="inputedUserID.length === 0"
                                        @click="deleteUser(user.id)">{{ $t("user.delete") }}</v-btn>
                                </v-col>
                                <v-col sm="2" cols="3">
                                    <v-btn variant="tonal" class="user-show-btn" color="customGreen"
                                        :to="{ name: 'users' }">{{
                                            $t("cancel") }}</v-btn>
                                </v-col>
                            </v-row>
                            <ErrorAlert v-if="wrongUserId" :error="wrongUserId" />
                            <ErrorAlert v-if="serverErrorForDelete" :error="serverErrorForDelete" />
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
import { defineComponent } from 'vue';
import BaseError from "@/api/errors/BaseError";
import ErrorAlert from "@/components/ErrorAlert.vue"
import { IErrorInComponent } from '@/utilities/error';
import { getTimeDifference } from '@/utilities';

export default defineComponent({
    setup() {
        return {
            getTimeDifference
        }
    },
    components: {
        ErrorAlert
    },
    data() {
        return {
            user: {} as IUser,
            serverError: undefined as undefined | IErrorInComponent,
            wrongUserId: undefined as undefined | IErrorInComponent,
            serverErrorForDelete: undefined as undefined | IErrorInComponent,
            loading: true,
            loadingDelete: false,
            inputedUserID: "",
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
        async deleteUser(id: number) {
            this.serverError = undefined;
            this.wrongUserId = undefined;
            this.serverErrorForDelete = undefined;

            if (this.inputedUserID !== this.user.id.toString()) {
                this.wrongUserId = {
                    message: this.$t('user.delete.confirm-userId')
                };
                this.inputedUserID = "";
                return;
            }
            this.loadingDelete = true;
            try {
                await useAPI().deleteUser(id);
                this.$router.push({name: 'users',query:{deletedUser:this.user.name} });
            }
            catch (e) {
                if (e instanceof BaseError) {
                    this.serverErrorForDelete = e.toComponentError();
                } else {
                    this.serverErrorForDelete = {
                        message: this.$t('server error')
                    };
                }
            }
            finally {
                this.loadingDelete = false;
            }
        }
    },
    async created() {
        this.$watch(
            () => this.$route.params,
            async () => {
                this.loading = true;
                try {
                    const response = await useAPI().getUser(parseInt(this.$route.params.id.toString()));
                    this.user = response;
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
    computed: {
        userDatas() {
            return [{ tilte: this.$t("user.phone-number"), value: this.user?.meta.cellphone }, { tilte: this.$t("user.email-address"), value: this.user?.meta.email }, { tilte: this.$t("user.joining-date"), value: this.user?.created_at }, { tilte: this.$t("user.city"), value: this.user?.meta.city }, { tilte: this.$t("user.country"), value: this.user?.meta.country }, { tilte: this.$t("user.role"), value: this.user?.type.title }, { tilte: this.$t("user.status"), value: this.user?.status }]
        }
    },
})

</script>
<style lang="scss">
.delete-user {
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
        font-size: 12px;
    }

    .v-table .v-table__wrapper>table>tbody>tr>td,
    th {
        --v-border-opacity: 0;
        font-size: 12.5px;
    }

}
</style>