<template>
    <v-container class="reset-password">
        <div class="text-primary title">{{ $t("user.forgot-password") }}</div>
        <div class="sub-title mt-2 text-secondary">{{ $t("user.reset-password") }}</div>
        <v-img width="180px" src="../../assets/pics/letter.svg" class="mx-auto"></v-img>
        <ErrorAlert class="text-start" v-if="invalidInputError" :error="invalidInputError" />
        <ErrorAlert v-if="serverError" :error="serverError" />
        <EnterUsername v-if="resetPassStep === 'enterUsername'" @submit="onSubmit" :loading="loading" />
        <Otp v-if="resetPassStep === 'otp'" @submitOtp="onSubmitOtp" @submit="onSubmit" :otpDigits="otpDigits"
            :loadingResend="loadingResend" :loadingConfirmOtp="loadingConfirmOtp"
            @goToEnterUsername="resetPassStep = 'enterUsername'" />
        <ChangePassword v-if="resetPassStep === 'changePass'" :loading="changePassLoading"
            @changePass="onSubmitChangePass" />


    </v-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAPI } from "@/api";
import UserLoginError from "@/api/errors/UserLoginError";
import EnterUsername from "@/components/ResetPassword/EnterUsername.vue";
import Otp from "@/components/ResetPassword/Otp.vue";
import ChangePassword from "@/components/ResetPassword/ChangePassword.vue";
import { useAuthStore } from "@/store/auth";
import ErrorAlert from "@/components/ErrorAlert.vue";
import { IErrorInComponent } from "@/utilities/error";
import BaseError from "@/api/errors/BaseError";

export default defineComponent({
    components: {
        EnterUsername,
        Otp,
        ChangePassword,
        ErrorAlert
    },
    data() {
        return {
            loading: false,
            validOtp: false,
            loadingResend: false,
            otpDigits: 0,
            otp: "",
            username: "",
            resetPassStep: "enterUsername",
            invalidInputError: undefined as undefined | IErrorInComponent,
            serverError: undefined as undefined | IErrorInComponent,
            sendCode: false,
            loadingConfirmOtp: false,
            changePassLoading: false,
        };
    },
    methods: {
        async onSubmit(username: string | undefined) {
            if (username) {
                this.username = username;
            }
            if (this.loading || this.loadingResend) return;
            this.loading = true;
            this.loadingResend = true;
            this.invalidInputError = undefined;
            this.serverError = undefined;
            try {
                const response = await useAPI().resetPassword({ username: username ? username : this.username });
                this.otpDigits = response.otp.digits;
                this.resetPassStep = "otp";
            }
            catch (e) {
                if (e instanceof UserLoginError) {
                    if (e instanceof BaseError) {
                        this.invalidInputError = e.toComponentError();
                    } else {
                        this.invalidInputError = {
                            message: this.$t('wrong inputed information')
                        };
                    }
                } else {
                    if (e instanceof BaseError) {
                        this.serverError = e.toComponentError();
                    } else {
                        this.serverError = {
                            message: this.$t('server error')
                        };
                    }
                }
            }
            finally {
                this.loading = false;
                this.loadingResend = false;
            }
        },
        usernameValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("username is necessary");
            }
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) && !/^0\d{10}$/.test(value)) {
                return this.$t("inputed username is invalid");
            }
            return true;
        },
        async onSubmitOtp(otp: string) {
            if (this.loadingConfirmOtp) {
                return;
            }
            this.loadingConfirmOtp = true;
            this.invalidInputError = undefined;
            this.serverError = undefined;
            try {
                const response = await useAPI().resetPassword({ username: this.username, otp });
                this.resetPassStep = "changePass";
                const authStore = useAuthStore();
                authStore.setUser(response.user);
            }
            catch (e) {
                if (e instanceof UserLoginError) {
                    if (e instanceof BaseError) {
                        this.invalidInputError = e.toComponentError();
                    } else {
                        this.invalidInputError = {
                            message: this.$t('wrong inputed information')
                        };
                    }
                } else {
                    if (e instanceof BaseError) {
                        this.serverError = e.toComponentError();
                    } else {
                        this.serverError = {
                            message: this.$t('server error')
                        };
                    }
                }
            }
            finally {
                this.loadingConfirmOtp = false;
            }
        },
        async onSubmitChangePass(password: string) {
            if (this.changePassLoading) {
                return;
            }
            this.changePassLoading = true;
            this.invalidInputError = undefined;
            this.serverError = undefined;
            try {
                await useAPI().changePassword({ password });
                const redirect = this.$route.query.redirect;
                if (redirect && typeof redirect == "string") {
                    this.$router.push({ path: redirect })
                } else {
                    this.$router.push({ name: "dashboard" })
                }
            }
            catch (e) {
                if (e instanceof UserLoginError) {
                    if (e instanceof BaseError) {
                        this.invalidInputError = e.toComponentError();
                    } else {
                        this.invalidInputError = {
                            message: this.$t('wrong inputed information')
                        };
                    }
                } else {
                    if (e instanceof BaseError) {
                        this.serverError = e.toComponentError();
                    } else {
                        this.serverError = {
                            message: this.$t('server error')
                        };
                    }
                }
            }
            finally {
                this.changePassLoading = false;
            }
        }
    }
});
</script>
<style lang="scss">
.reset-password {
    .title {
        font-weight: 600;
        font-size: 16px;
    }

    .sub-title {
        font-size: 13.5px;
    }

    .v-field__input {
        --v-field-input-padding-top: 7px;
        --v-field-input-padding-bottom: 7px;
        --v-input-control-height: 0px;
        --v-field-padding-start: 20px;
    }
}
</style>