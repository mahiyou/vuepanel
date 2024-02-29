<template>
    <div class="add-user">
        <div class="banner">
            <v-img :src="bannerUrl || '/pics/defaultBanner.jpg'">
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
                        <v-img :src="avatarUrl || '/pics/default-avatar.jpg'" class="rounded-circle my-2 user-avatar"
                            width="120px" height="120px">
                        </v-img>
                        <div class="camera-btn file-input">
                            <v-file-input prepend-icon="mdi-camera" v-model="newAvatar"
                                @change="onAvatarChange"></v-file-input>
                        </div>
                    </div>
                </v-card>
                <v-card class="pa-sm-5 px-3 pb-3 mt-4 mb-15" elevation="1">
                    <v-form @submit.prevent="onSubmit" class="my-6" v-model="valid">
                        <v-row>
                            <v-col sm="6" cols="12">
                                <div>{{ $t("user.name") }}*</div>
                                <v-text-field variant="outlined" v-model="newUser.name" :dir="$vuetify.locale.current"
                                    class="mb-2" :rules="[nameValidation]" />
                                <div>{{ $t("user.status") }}</div>
                                <v-select v-model="newUser.status" variant="outlined" :items="statusItems"
                                    item-title="title" item-value="value" class="mb-2"
                                    :placeholder="$t('user.status.select')"></v-select>
                                <div>{{ $t("user.email-address") }}</div>
                                <v-text-field variant="outlined" v-model="newUser.meta.email" dir="ltr" class="mb-2"
                                    :rules="[emailValidation]" />
                                <div>{{ $t("user.new-password") }}*</div>
                                <v-text-field variant="outlined" v-model="password" dir="ltr"
                                    :rules="[passwordValidation]" />

                            </v-col>
                            <v-col sm="6" cols="12">
                                <div>{{ $t("user.username") }}*</div>
                                <v-text-field variant="outlined" v-model="newUser.username" :dir="$vuetify.locale.current"
                                    class="mb-2" :rules="[usernameValidation]" />
                                <div>{{ $t("user.phone-number") }}</div>
                                <v-text-field variant="outlined" v-model="newUser.meta.phoneNumber" dir="ltr"
                                    :rules="[phoneNumberValidation]" class="mb-2" />

                                <div>{{ $t("user.role") }}*</div>
                                <v-select v-model="newUser.type_id" variant="outlined" :items="[1, 2]" class="mb-2"
                                    :placeholder="$t('user.role.select')" :rules="[roleValidation]"></v-select>

                                <div>{{ $t("confirm password") }}*</div>
                                <v-text-field variant="outlined" v-model="confirmPass" dir="ltr"
                                    :rules="[repeatPasswordValidation]" />
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col sm="4" cols="12">
                                <div>{{ $t("user.city") }}</div>
                                <v-text-field variant="outlined" v-model="newUser.meta.city" :dir="$vuetify.locale.current"
                                    class="mb-2" />
                            </v-col>
                            <v-col sm="4" cols="12">
                                <div>{{ $t("user.country") }}</div>
                                <v-text-field variant="outlined" v-model="newUser.meta.country"
                                    :dir="$vuetify.locale.current" class="mb-2" />
                            </v-col>
                            <v-col sm="4" cols="12">
                                <div>{{ $t("user.zip-code") }}</div>
                                <v-text-field variant="outlined" v-model="newUser.meta.zipCode" dir="ltr" class="mb-2" />
                            </v-col>
                        </v-row>
                        <v-btn type="submit" class="px-5 float-end" color="primary" variant="flat"
                            :loading="updateLoading">{{ $t("user.add")
                            }}</v-btn>
                    </v-form>

                    <ErrorAlert class="mt-15 mx-4" v-if="incorrectRepeatPass" :error="incorrectRepeatPass" />
                    <ErrorAlert class="mt-15 mx-4" v-if="invalidInputError" :error="invalidInputError" />
                    <ErrorAlert class="mt-15 mx-4" v-if="serverErrorForUpdate" :error="serverErrorForUpdate" />
                    <v-alert closable class="mt-15 mx-4" v-if="successfulUpdate" :text="$t('user.update.succesful')"
                        type="success" variant="tonal"></v-alert>

                </v-card>
            </div>
        </v-container>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useAPI } from "@/api"
import { IUser, UserStatus } from '@/api/authentication';
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
            serverError: undefined as undefined | IErrorInComponent,
            invalidInputError: undefined as undefined | IErrorInComponent,
            updateLoading: false,
            serverErrorForUpdate: undefined as undefined | IErrorInComponent,
            serverErrorForPassChange: undefined as undefined | IErrorInComponent,
            incorrectRepeatPass: undefined as undefined | IErrorInComponent,
            successfulUpdate: false,
            confirmBtn: true,
            valid: false,
            newBanner: undefined as File[] | undefined,
            newAvatar: undefined as File[] | undefined,
            avatarUrl: "",
            bannerUrl: "",

            newUser: {
                name: "",
                username: "",
                meta: {
                    phoneNumber: "",
                    email: "",
                    city: "",
                    country: "",
                    zipCode: "",
                },
                type_id: 1,
                status: undefined as unknown as UserStatus,
            },

            password: "",
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
            if (value && !/^0\d{10}$/.test(value)) {
                return this.$t("invalid.user.phone-number");
            }
            return true;
        },
        emailValidation(value: string): boolean | string {
            if (value && !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
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
        nameValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("user.name.required");
            }
            return true;
        },
        usernameValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("user.name.required");
            }
            return true;
        },
        
        roleValidation(value: any): boolean | string {
            if (!value) {
                return this.$t("user.role.required");
            }
            return true;
        },
        async onSubmit() {
            this.incorrectRepeatPass = undefined;
            if (this.password !== this.confirmPass) {
                this.incorrectRepeatPass = {
                    message: this.$t('password.confirm-password.not-matching')
                };
                return;
            } else {
                this.incorrectRepeatPass = undefined;
            }
            try {
                const response = await useAPI().addUser({
                    name: this.newUser.name,
                    status: this.newUser.status,
                    type_id: this.newUser.type_id,
                    usernames:[this.newUser.username]
                })
            }
            catch {

            }

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
})
</script>
<style lang="scss">
.add-user {
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
