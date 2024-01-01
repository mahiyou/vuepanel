<template>
    <v-container class="reset-password">
        <div class="text-primary title">رمز عبور خود را فراموش کرده اید؟</div>
        <div class="sub-title mt-2 text-secondary">رمز خود را تغییر دهید</div>
        <v-img width="180px" src="../../assets/pics/letter.svg" class="mx-auto"></v-img>
        <v-alert class="my-4 text-right" v-if="invalidInputError" text="اطلاعات وارد شده صحیح نیست" type="error"
            variant="tonal"></v-alert>
        <v-alert class="my-4 text-right" v-if="serverError" text="خطای سرور" type="error" variant="tonal"></v-alert>
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

export default defineComponent({
    components: {
        EnterUsername,
        Otp,
        ChangePassword,
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
            invalidInputError: false,
            serverError: false,
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
            this.invalidInputError = false;
            this.serverError = false;
            try {
                const response = await useAPI().resetPassword({ username: username ? username : this.username });
                this.otpDigits = response.otp.digits;
                this.resetPassStep = "otp";
            }
            catch (e) {
                if (e instanceof UserLoginError) {
                    this.invalidInputError = true;
                } else {
                    this.serverError = true;
                }
            }
            finally {
                this.loading = false;
                this.loadingResend = false;
            }
        },
        usernameValidation(value: string): boolean | string {
            if (!value) {
                return "وارد کردن نام کاربری الزامی است.";
            }
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) && !/^0\d{10}$/.test(value)) {
                return "نام کاربری وارد شده معتبر نیست.";
            }
            return true;
        },
        async onSubmitOtp(otp: string) {
            if (this.loadingConfirmOtp) {
                return;
            }
            this.loadingConfirmOtp = true;
            this.invalidInputError = false;
            this.serverError = false;
            try {
                const response = await useAPI().resetPassword({ username: this.username, otp });
                this.resetPassStep = "changePass";
                const authStore = useAuthStore();
                authStore.setUser(response.user);
            }
            catch (e) {
                if (e instanceof UserLoginError) {
                    this.invalidInputError = true;
                } else {
                    this.serverError = true;
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
            this.invalidInputError = false;
            this.serverError = false;
            try {
                await useAPI().changePassword({ password });
                this.$router.push({ name: "dashboard" });
            }
            catch (e) {
                if (e instanceof UserLoginError) {
                    this.invalidInputError = true;
                } else {
                    this.serverError = true;
                }
            }
            finally{
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