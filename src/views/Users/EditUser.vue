<template>
    <div class="edit-user" v-if="!loading && !serverError">
        <div class="banner">
            <v-img :src="bannerUrl || user.meta.banner || '/pics/defaultBanner.jpg'">
                <div class="bg-overlay"></div>
            </v-img>
        </div>
        <v-container>
            <div class="mt-1 ms-1 file-input">
                <v-file-input prepend-icon="mdi-image-edit-outline" v-model="newBanner"
                    @change="onBannerChange"></v-file-input>
            </div><br /><br />
            <div class="cards">
                <v-card class="pa-4 text-center" elevation="1">
                    <div class="avatar-div mx-auto">
                        <v-img :src="avatarUrl || user.meta.avatar || '/pics/default-avatar.jpg'"
                            class="rounded-circle my-2 user-avatar" width="120px" height="120px">
                        </v-img>
                        <div class="camera-btn file-input">
                            <v-file-input prepend-icon="mdi-camera" v-model="newAvatar"
                                @change="onAvatarChange"></v-file-input>
                        </div>
                    </div>
                    <h2 class="text-textColor">{{ user.name }}</h2>
                    <div class="text-secondary">{{ user.type.title }}</div>
                </v-card>
                <v-card class="pa-3 my-4" elevation="1">
                    <v-tabs v-model="tab" color="primary" align-tabs="start">
                        <v-tab :value="1">{{ $t("user.personal-details") }}</v-tab>
                        <v-tab :value="2">{{ $t("user.change-password") }}</v-tab>
                    </v-tabs>
                    <v-window v-model="tab" class="mb-15">
                        <v-window-item :value="1">
                            <v-container>
                                <v-form @submit.prevent="onSubmit" @change="dataChanged" class="my-6" v-model="valid">
                                    <v-row>
                                        <v-col cols="6">
                                            <div>{{ $t("user.name") }}</div>
                                            <v-text-field variant="outlined" v-model="newUser.name"
                                                :dir="$vuetify.locale.current" class="mb-2" />
                                            <div>{{ $t("user.status") }}</div>
                                            <v-select v-model="newUser.status" clearable variant="outlined"
                                                :items="statusItems" item-title="title" item-value="value" class="mb-2"
                                                :placeholder="$t('user.status.select')"
                                                @update:model-value="dataChanged"></v-select>

                                            <div>{{ $t("user.email-address") }}</div>
                                            <v-text-field variant="outlined" v-model="newUser.meta.email" dir="ltr"
                                                class="mb-2" :rules="[emailValidation]" />

                                        </v-col>
                                        <v-col cols="6">
                                            <div>{{ $t("user.phone-number") }}</div>
                                            <v-text-field variant="outlined" v-model="newUser.meta.phoneNumber" dir="ltr"
                                                :rules="[phoneNumberValidation]" class="mb-2" />

                                            <div>{{ $t("user.role") }}</div>
                                            <v-select v-model="newUser.type_id" clearable variant="outlined"
                                                :items="[1, 2]" class="mb-2"
                                                :placeholder="$t('user.role.select')"
                                                @update:model-value="dataChanged"></v-select>

                                            <div>{{ $t("user.joining-date") }}</div>
                                            <v-text-field variant="outlined" v-model="newUser.joiningDate" dir="ltr"
                                                class="mb-2" />
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <div>{{ $t("user.city") }}</div>
                                            <v-text-field variant="outlined" v-model="newUser.meta.city"
                                                :dir="$vuetify.locale.current" class="mb-2" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("user.country") }}</div>
                                            <v-text-field variant="outlined" v-model="newUser.meta.country"
                                                :dir="$vuetify.locale.current" class="mb-2" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("user.zip-code") }}</div>
                                            <v-text-field variant="outlined" v-model="newUser.meta.zipCode" dir="ltr"
                                                class="mb-2" />
                                        </v-col>
                                    </v-row>
                                    <v-btn type="submit" class="px-5 float-end" color="primary" variant="flat"
                                        :loading="updateLoading">{{ $t("edit.user.updates")
                                        }}</v-btn>
                                </v-form>

                            </v-container>

                            <ErrorAlert class="mt-4 mx-4" v-if="invalidInputError" :error="invalidInputError" />
                            <ErrorAlert class="mt-4 mx-4" v-if="serverErrorForUpdate" :error="serverErrorForUpdate" />
                            <v-alert closable class="mt-4 mx-4" v-if="successfulUpdate" :text="$t('user.update.succesful')"
                                type="success" variant="tonal"></v-alert>
                        </v-window-item>
                        <v-window-item :value="2">
                            <v-container>
                                <v-form @submit.prevent="onSubmitChangPassword" v-model="validChangPasswordForm"
                                    class="my-6">
                                    <v-row>
                                        <v-col>
                                            <div>{{ $t("user.new-password") }}*</div>
                                            <v-text-field variant="outlined" v-model="newPass" dir="ltr"
                                                :rules="[passwordValidation]" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("confirm password") }}*</div>
                                            <v-text-field variant="outlined" v-model="confirmPass" dir="ltr"
                                                :rules="[repeatPasswordValidation]" />
                                        </v-col>
                                    </v-row>
                                    <v-btn type="submit" class="px-5 mt-2 float-end" color="customGreen" variant="flat"
                                        :loading="changPassLoading" :disabled="!validChangPasswordForm">{{
                                            $t("reset-password") }}</v-btn>
                                </v-form>
                            </v-container>

                            <ErrorAlert class="mt-4 mx-4" v-if="incorrectRepeatPass" :error="incorrectRepeatPass" />

                            <v-alert closable class="mt-4 mx-4" v-if="successfulChangePass"
                                :text="$t('user.update.succesful')" type="success" variant="tonal"></v-alert>

                            <ErrorAlert class="mt-4 mx-4" v-if="serverErrorForPassChange"
                                :error="serverErrorForPassChange" />

                        </v-window-item>
                    </v-window>
                </v-card>
            </div>
        </v-container>
    </div>
    <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <ErrorAlert v-if="serverError" :error="serverError" />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useAPI } from "@/api"
import { IUser, UserStatus } from '@/api/authentication';
import InputValidationError from '@/api/errors/InputValidationError';
import { IErrorInComponent } from '@/utilities/error';
import ErrorAlert from "@/components/ErrorAlert.vue"
import BaseError from '@/api/errors/BaseError';

export default defineComponent({
    components: {
        ErrorAlert
    },
    setup() {
        return { UserStatus }
    },
    data() {
        return {
            user: {} as IUser,
            serverError: undefined as undefined | IErrorInComponent,
            loading: true,
            tab: 1,
            invalidInputError: undefined as undefined | IErrorInComponent,
            updateLoading: false,
            serverErrorForUpdate: undefined as undefined | IErrorInComponent,
            serverErrorForPassChange: undefined as undefined | IErrorInComponent,
            incorrectRepeatPass: undefined as undefined | IErrorInComponent,
            successfulUpdate: false,
            successfulChangePass: false,
            confirmBtn: true,
            changPassLoading: false,
            validChangPasswordForm: false,
            valid: false,
            newBanner: undefined as File[] | undefined,
            newAvatar: undefined as File[] | undefined,
            avatarUrl: "",
            bannerUrl: "",

            newUser: {
                name: "",
                meta: {
                    phoneNumber: "",
                    email: "",
                    city: "",
                    country: "",
                    zipCode: "",
                },
                type_id: 0,
                status: undefined as unknown as UserStatus,
                joiningDate: "",
            },

            newPass: "",
            confirmPass: "",
        }
    },
    methods: {
        passwordValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("password is necessary");
            }
            return true;
        },
        phoneNumberValidation(value: string): boolean | string {
            if (!/^0\d{10}$/.test(value)) {
                return this.$t("invalid.user.phone-number");
            }
            return true;
        },
        emailValidation(value: string): boolean | string {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
                return this.$t("invalid.email");
            }
            return true;
        },
        repeatPasswordValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("user.password-confirmation.required");
            }
            return true;
        },
        async onSubmit() {
            this.updateLoading = true;
            this.invalidInputError = undefined;
            this.serverErrorForUpdate = undefined;
            this.successfulUpdate = false;
            try {
                const response = await useAPI().editUser({
                    userId: this.user.id.toString(),
                    name: this.newUser.name,
                    status: this.newUser.status,
                    type_id: this.newUser.type_id
                })
                this.user = response;


                this.newUser.name = this.user.name;
                this.newUser.meta.phoneNumber = this.user.meta.phoneNumber || undefined;
                this.newUser.type_id = this.user.type_id || 0;
                this.newUser.status = this.user.status;
                this.newUser.meta.email = this.user.meta.email || undefined;
                this.newUser.meta.city = this.user.meta.city || undefined;
                this.newUser.meta.country = this.user.meta.country || undefined;
                this.newUser.meta.zipCode = this.user.meta.zipCode || undefined;
                this.newUser.joiningDate = this.user.created_at.toLocaleDateString();
                this.avatarUrl = this.user.meta.avatar || "/pics/default-avatar.jpg";
                this.bannerUrl = this.user.meta.banner || "/pics/defaultBanner.jpg";


                this.successfulUpdate = true;
                this.confirmBtn = true;
            }
            catch (e) {
                if (e instanceof InputValidationError) {
                    if (e instanceof BaseError) {
                        this.invalidInputError = e.toComponentError();
                    } else {
                        this.invalidInputError = {
                            message: this.$t('wrong inputed information')
                        };
                    }
                } else {
                    if (e instanceof BaseError) {
                        this.serverErrorForUpdate = e.toComponentError();
                    } else {
                        this.serverErrorForUpdate = {
                            message: this.$t('server error')
                        };
                    }
                }
            }
            finally {
                this.updateLoading = false;
            }

        },
        async onSubmitChangPassword() {
            this.serverErrorForPassChange = undefined;
            this.successfulChangePass = false;
            this.incorrectRepeatPass = undefined;
            if (this.newPass !== this.confirmPass) {
                this.incorrectRepeatPass = {
                    message: this.$t('password.confirm-password.not-matching')
                };
                return;
            } else {
                this.incorrectRepeatPass = undefined;
            }
            this.changPassLoading = true;
            try {
                await useAPI().changeUserPassword({ id: parseInt(this.$route.params.id.toString()), password: this.newPass })
                this.successfulChangePass = true;
            }
            catch (e) {
                if (e instanceof BaseError) {
                    this.serverErrorForPassChange = e.toComponentError();
                } else {
                    this.serverErrorForPassChange = {
                        message: this.$t('server error')
                    };
                }
            }
            finally {
                this.changPassLoading = false;
            }

        },
        dataChanged() {
            this.confirmBtn = false;
        },
        onAvatarChange() {
            this.confirmBtn = false;
            if (!this.newAvatar || this.newAvatar.length == 0) {
                return;
            }
            this.avatarUrl = URL.createObjectURL(this.newAvatar[0]);
            console.log(this.avatarUrl)
        },
        onBannerChange() {
            this.confirmBtn = false;
            if (!this.newBanner || this.newBanner.length == 0) {
                return;
            }
            this.bannerUrl = URL.createObjectURL(this.newBanner[0]);
        }
    },
    computed: {
        statusItems() {
            return [
                { title: this.$t('user.status.ACTIVE'), value: UserStatus.ACTIVE },
                { title: this.$t('user.status.SUSPENDED'), value: UserStatus.SUSPENDED }
            ]
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
                    this.newUser.name = this.user.name;
                    this.newUser.meta = this.user.meta;
                    this.newUser.type_id = this.user.type_id;
                    this.newUser.status = this.user.status;
                    this.newUser.joiningDate = this.user.created_at.toLocaleDateString();
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
    }
})
</script>
<style lang="scss">
.edit-user {
    .banner {
        height: 320px;
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
        height: 320px;
    }


    .cards {
        top: 70px;
        position: relative;
    }

    .avatar-div {
        width: fit-content;
        position: relative;

        .v-input__prepend {
            font-size: 10px;
            background-color: #e8e9eb;
            border-radius: 20px;
            padding: 8px;
        }

        .camera-btn {
            position: absolute;
            top: 80px;
        }
    }

    .v-input__prepend>.v-icon {
        opacity: 1;
    }

    .user-avatar {
        border: 5px solid rgb(var(--v-theme-secondary), 0.2);
    }

    .file-input {
        .v-input__control {
            display: none;
        }
    }
}
</style>
