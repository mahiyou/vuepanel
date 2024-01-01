<template>
    <v-container class="login">
        <div class="text-primary title">خوش آمدید!</div>
        <div class="sub-title mt-2 text-secondary">برای ادامه وارد شوید</div>
        <v-form @submit.prevent="onSubmit" v-model="valid" class="text-right">
            <div class="mt-9 mb-2">نام کاربری (ایمیل و یا شماره موبایل)</div>
            <v-text-field variant="outlined" v-model="username" dir="ltr" :rules="[usernameValidation]" />
            <v-row class="mt-2">
                <v-col cols="6">
                    <div class="mb-2">رمز عبور</div>
                </v-col>
                <v-col cols="6" class="">
                    <router-link :to="{ name: 'resetPassword' }"
                        class="link text-secondary text-decoration-none float-left">فراموشی رمز عبور</router-link>
                </v-col>
            </v-row>

            <v-text-field variant="outlined" v-model="password" dir="ltr" :rules="[passwordValidation]" />

            <v-checkbox color="primary" v-model="checkbox" label="مرا به خاطر بسپار" class="checkbox"></v-checkbox>

            <v-btn class="px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat" :loading="loading"
                :disabled="!valid">
                ورود
            </v-btn>
            <v-alert class="my-2" v-if="invalidInputError" text="اطلاعات وارد شده صحیح نیست" type="error"
                variant="tonal"></v-alert>
            <v-alert class="my-2" v-if="serverError" text="خطای سرور" type="error"
                variant="tonal"></v-alert>

            <div class="text-center mt-8">
                <p class="mb-6">ورود از طریق:</p>
                <v-btn icon="mdi-facebook" size="small" variant="flat" color="#405189" class="mx-1"></v-btn>
                <v-btn icon="mdi-google" size="small" variant="flat" color="#f06548" class="mx-1"></v-btn>
                <v-btn icon="mdi-github" size="small" variant="flat" color="#212529" class="mx-1"></v-btn>
                <v-btn icon="mdi-twitter" size="small" variant="flat" color="#299cdb" class="mx-1"></v-btn>
                <div class="mt-8">
                    هنوز حساب کاربری ندارید؟
                    <router-link :to="{ name: 'register' }" class="link text-primary">ثبت نام</router-link>
                </div>
            </div>

        </v-form>
    </v-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/store/auth";
import { useAPI } from "@/api";
import UserLoginError from "@/api/errors/UserLoginError";

export default defineComponent({
    data() {
        return {
            valid: false,
            username: "",
            password: "",
            checkbox: false,
            loading: false,
            invalidInputError: false,
            serverError: false,
        };
    },
    methods: {
        async onSubmit() {
            if (this.loading) {
                return;
            }
            this.loading = true;
            this.serverError = false;
            this.invalidInputError = false;
            try {
                const response = await useAPI().login({ username: this.username, password: this.password });
                const authStore = useAuthStore();
                authStore.setUser(response.user);
                this.$router.push({ name: "dashboard" });
            } catch(e) {
                if (e instanceof UserLoginError) {
                    this.invalidInputError = true;
                } else {
                    this.serverError = true;
                }
            } finally {
                this.loading = false;
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
        passwordValidation(value: string): boolean | string {
            if (!value) {
                return "وارد کردن رمز عبور الزامی است.";
            }
            return true;
        },
    }
});

</script>
<style lang="scss">
.login {
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

    .checkbox {
        font-size: 13px;
        padding: 0px;

        .v-label--clickable {
            font-size: 13px;
        }
    }

}
</style>