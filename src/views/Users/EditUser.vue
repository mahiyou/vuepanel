<template>
    <div class="edit-user" v-if="!loading && !serverError">
        <div class="banner">
            <div class="bg-overlay"></div>
        </div>
        <v-container class="pb-15">
            <div class="img-card pb-15">
                <v-card class="pa-4 text-center" elevation="1">
                    <v-img :src="user.avatar || '/pics/default-avatar.jpg'" class="rounded-circle my-2 mx-auto user-avatar"
                        width="120px" height="120px"></v-img>
                    <h2 class="text-textColor">{{ user.name }}</h2>
                    <div class="text-secondary">{{ user.role }}</div>
                </v-card>
                <v-card class="pa-3 my-4" elevation="1">
                    <v-tabs v-model="tab" color="primary" align-tabs="start">
                        <v-tab :value="1">{{ $t("personal details") }}</v-tab>
                        <v-tab :value="2">{{ $t("change password") }}</v-tab>
                    </v-tabs>
                    <v-window v-model="tab" class="mb-15">
                        <v-window-item :value="1">
                            <v-container>
                                <v-form @submit.prevent="onSubmit" class="my-6" v-model="valid">
                                    <v-row>
                                        <v-col cols="6">
                                            <div>{{ $t("name") }}</div>
                                            <v-text-field variant="outlined" v-model="name" dir="ltr"
                                                @update:model-value="dataChanged" class="mb-2" />
                                            <div>{{ $t("status") }}</div>
                                            <v-select v-model="status" clearable variant="outlined"
                                                :items="[Status.ACTIVE, Status.SUSPENDED]" @update:model-value="dataChanged"
                                                class="mb-2"></v-select>

                                            <div>{{ $t("email address") }}</div>
                                            <v-text-field variant="outlined" v-model="email" dir="ltr"
                                                @update:model-value="dataChanged" class="mb-2" :rules="[emailValidation]" />

                                        </v-col>
                                        <v-col cols="6">

                                            <div>{{ $t("phone number") }}</div>
                                            <v-text-field variant="outlined" v-model="phoneNumber" dir="ltr"
                                                @update:model-value="dataChanged" :rules="[phoneNumberValidation]"
                                                class="mb-2" />

                                            <div>{{ $t("role") }}</div>
                                            <v-select v-model="role" clearable variant="outlined"
                                                :items="[Role.ADMIN, Role.USER]" @update:model-value="dataChanged"
                                                class="mb-2"></v-select>

                                            <div>{{ $t("joining date") }}</div>
                                            <v-text-field variant="outlined" v-model="joiningDate" dir="ltr"
                                                @update:model-value="dataChanged" class="mb-2" />
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col>
                                            <div>{{ $t("city") }}</div>
                                            <v-text-field variant="outlined" v-model="city" dir="ltr"
                                                @update:model-value="dataChanged" class="mb-2" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("country") }}</div>
                                            <v-text-field variant="outlined" v-model="country" dir="ltr"
                                                @update:model-value="dataChanged" class="mb-2" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("zip code") }}</div>
                                            <v-text-field variant="outlined" v-model="zipCode" dir="ltr"
                                                @update:model-value="dataChanged" class="mb-2" />
                                        </v-col>
                                    </v-row>
                                    <v-btn type="submit" class="px-5 float-end" color="primary" variant="flat"
                                        :disabled="confirmBtn || !valid" :loading="updateLoading">{{ $t("updates")
                                        }}</v-btn>
                                </v-form>

                            </v-container>
                            <v-alert closable class="mt-4 mx-4" v-if="invalidInputError"
                                :text="$t('wrong inputed information')" type="error" variant="tonal"></v-alert>
                            <v-alert closable class="mt-4 mx-4" v-if="successfulUpdate" :text="$t('succesful update')"
                                type="success" variant="tonal"></v-alert>
                            <v-alert closable class="mt-4 mx-4" v-if="serverErrorForUpdate" :text="$t('server error')"
                                type="error" variant="tonal"></v-alert>
                        </v-window-item>
                        <v-window-item :value="2">
                            <v-container>
                                <v-form @submit.prevent="onSubmitChangPassword" v-model="validChangPasswordForm"
                                    class="my-6">
                                    <v-row>
                                        <v-col>
                                            <div>{{ $t("new password") }}*</div>
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
                                            $t("reset password") }}</v-btn>
                                </v-form>
                            </v-container>
                            <v-alert closable class="mt-4 mx-4" v-if="incorrectRepeatPass"
                                :text="$t('password and confirm password')" type="error" variant="tonal"></v-alert>
                            <v-alert closable class="mt-4 mx-4" v-if="successfulChangePass" :text="$t('succesful update')"
                                type="success" variant="tonal"></v-alert>
                            <v-alert closable class="mt-4 mx-4" v-if="serverErrorForPassChange" :text="$t('server error')"
                                type="error" variant="tonal"></v-alert>
                        </v-window-item>
                    </v-window>
                </v-card>
            </div>
        </v-container>
    </div>
    <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-alert class="mx-4" v-if="serverError" :text="$t('server error')" type="error" variant="tonal"></v-alert>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useAPI } from "@/api"
import { IUser, Role, Status } from '@/api/authentication';
import InputValidationError from '@/api/errors/InputValidationError';

export default defineComponent({
    setup() {
        return { Status, Role }
    },
    data() {
        return {
            user: {} as IUser,
            serverError: false,
            loading: true,
            tab: 1,
            invalidInputError: false,
            updateLoading: false,
            serverErrorForUpdate: false,
            serverErrorForPassChange: false,
            incorrectRepeatPass: false,
            successfulUpdate: false,
            successfulChangePass: false,
            confirmBtn: true,
            changPassLoading: false,
            validChangPasswordForm: false,
            valid: false,

            name: "",
            phoneNumber: "",
            role: undefined as unknown as Role,
            status: undefined as unknown as Status,
            email: "",
            city: "",
            country: "",
            zipCode: "",
            joiningDate: "",

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
                return this.$t("inputed phone number is invalid");
            }
            return true;
        },
        emailValidation(value: string): boolean | string {
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
                return this.$t("inputed email is invalid");
            }
            return true;
        },
        repeatPasswordValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("password confirmation is necessary");
            }
            return true;
        },
        async onSubmit() {
            this.updateLoading = true;
            this.invalidInputError = false;
            this.serverErrorForUpdate = false;
            this.successfulUpdate = false;
            try {
                await useAPI().editUser({
                    id: this.user.id,
                    token: this.user.token,
                    abilities: this.user.abilities,
                    name: this.name,
                    role: this.role,
                    status: this.status,
                    email: this.email,
                    phoneNumber: this.phoneNumber,
                    city: this.city,
                    country: this.country,
                    zipCode: this.zipCode
                })
                this.successfulUpdate = true;
                this.confirmBtn = true;
            }
            catch (e) {
                if (e instanceof InputValidationError) {
                    this.invalidInputError = true;
                } else {
                    this.serverErrorForUpdate = true;
                }
            }
            finally {
                this.updateLoading = false;
            }

        },
        async onSubmitChangPassword() {
            this.serverErrorForPassChange = false;
            this.successfulChangePass = false;
            this.incorrectRepeatPass = false;
            if (this.newPass !== this.confirmPass) {
                this.incorrectRepeatPass = true;
                return;
            } else {
                this.incorrectRepeatPass = false;
            }
            this.changPassLoading = true;
            try {
                await useAPI().changeUserPassword({ id: parseInt(this.$route.params.id.toString()), password: this.newPass })
                this.successfulChangePass = true;
            }
            catch {
                this.serverErrorForPassChange = true;
            }
            finally {
                this.changPassLoading = false;
            }

        },
        dataChanged() {
            this.confirmBtn = false;
        }
    },
    async mounted() {
        try {
            const response = await useAPI().getUser(parseInt(this.$route.params.id.toString()));
            this.user = response.user;
            this.name = this.user.name || "";
            this.phoneNumber = this.user.phoneNumber || "";
            this.role = this.user.role || "";
            this.status = this.user.status || "";
            this.email = this.user.email || "";
            this.city = this.user.city || "";
            this.country = this.user.country || "";
            this.zipCode = this.user.zipCode || "";
            this.joiningDate = this.user.joiningDate || "";
        }
        catch {
            this.serverError = true;
        }
        finally {
            this.loading = false;
        }
    }
})
</script>
<style lang="scss">
.edit-user {
    .banner {
        background-image: url("@/assets/pics/defaultBanner.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        height: 320px;
        background-position: top;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0px;
        margin: 0px;
        z-index: 0;
    }

    .bg-overlay {
        background: linear-gradient(90deg, #364574, #405189);
        opacity: 0.9;
        height: 320px;
    }

    .img-card {
        position: relative;
        top: 180px;
    }

    .user-avatar {
        border: 5px solid rgb(var(--v-theme-secondary), 0.2);
    }
}
</style>
