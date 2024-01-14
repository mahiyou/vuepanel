<template>
    <v-container class="register">
        <div class="text-primary title">{{ $t("new account") }}</div>
        <div class="sub-title mt-2 text-secondary">{{ $t("creat your own acount") }}</div>
        <v-form @submit.prevent="onSubmit" v-model="valid" class="text-start">
            <div class="mt-6 mb-2">{{ $t("username(email or cell phone)") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="username" dir="ltr" :rules="[usernameValidation]" />

            <div class="mt-2 mb-2">{{ $t("password") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="password" dir="ltr" :rules="[passwordValidation]" />

            <div class="mt-2 mb-2">{{ $t("confirm password") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="repeartPassword" dir="ltr" :rules="[repeatPasswordValidation]" />

            <div class="text-secondary mt-2">{{ $t("By registering you agree to the terms") }} <router-link
                    :to="{ name: 'register' }" class="text-primary">{{ $t("terms and conditions") }}</router-link></div>

            <v-btn class="mt-6 px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat"
                :disabled="!valid" :loading="loading">
                {{ $t("sign up") }}
            </v-btn>
            <v-alert class="my-2" v-if="invalidInputError" :text="$t('wrong inputed information')" type="error"
                variant="tonal"></v-alert>
            <v-alert class="my-2" v-if="serverError" :text="$t('server error')" type="error" variant="tonal"></v-alert>
            <v-alert class="my-2" v-if="incorrectRepeatPass" :text="$t('password and confirm password')"
                type="error" variant="tonal"></v-alert>
            <div class="text-center mt-8">
                <p class="mb-6">{{ $t("create account with") }}</p>
                <v-btn icon="mdi-facebook" size="small" variant="flat" color="#405189" class="mx-1"></v-btn>
                <v-btn icon="mdi-google" size="small" variant="flat" color="#f06548" class="mx-1"></v-btn>
                <v-btn icon="mdi-github" size="small" variant="flat" color="#212529" class="mx-1"></v-btn>
                <v-btn icon="mdi-twitter" size="small" variant="flat" color="#299cdb" class="mx-1"></v-btn>
                <div class="mt-8">
                    {{ $t("already have an account") }}
                    <router-link :to="{ name: 'login' }" class="link text-primary">{{ $t("sign in") }}</router-link>
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
            password: "",
            checkbox: false,
            username: "",
            repeartPassword: "",
            loading: false,
            serverError: false,
            invalidInputError: false,
            incorrectRepeatPass: false,
        };
    },
    methods: {
        async onSubmit() {
            if (this.password !== this.repeartPassword) {
                this.incorrectRepeatPass = true;
                return;
            } else {
                this.incorrectRepeatPass = false;
            }
            this.serverError = false;
            this.invalidInputError = false;
            if (this.loading) {
                return;
            }
            this.loading = true;
            try {
                const response = await useAPI().register({
                    username: this.username,
                    password: this.password,
                });

                const authStore = useAuthStore();
                authStore.setUser(response.user);
                this.$router.push({ name: "dashboard" });
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
        passwordValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("password is necessary");
            }
            return true;
        },
        repeatPasswordValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("password confirmation is necessary");
            }
            return true;
        },
    }
});

</script>
<style lang="scss">
.register {
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