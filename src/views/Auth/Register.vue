<template>
    <v-container class="register">
        <div class="text-primary title">{{ $t("new account") }}</div>
        <div class="sub-title mt-2 text-secondary">{{ $t("create your own account") }}</div>
        <v-form @submit.prevent="onSubmit" v-model="valid" class="text-start">

            <div class="mt-6 mb-2">{{ $t("user.name") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="name" dir="ltr" :rules="[nameValidation]" />

            <div class="mt-6 mb-2">{{ $t("user.phone-number") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="phone" @change="phoneChanged" dir="ltr"
                :error-messages="errors ? errors.cellphone : ''" :rules="[phoneValidation]" />

            <div class="mt-6 mb-2">{{ $t("user.email-address") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="email" dir="ltr" @change="emailChanged"
                :error-messages="errors ? errors.email : ''" :rules="[emailValidation]" />

            <div class="mt-2 mb-2">{{ $t("user.password") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="password" dir="ltr" :rules="[passwordValidation]" />

            <div class="mt-2 mb-2">{{ $t("confirm password") }}<span class="text-red"> *</span></div>
            <v-text-field variant="outlined" v-model="repeartPassword" dir="ltr" :rules="[repeatPasswordValidation]" />

            <div class="text-secondary mt-2">{{ $t("By registering you agree to the terms") }} <router-link
                    :to="{ name: 'register', params: { lang: $vuetify.locale.current } }" class="text-primary">{{
                    $t("terms and conditions") }}</router-link></div>

            <v-btn class="mt-6 px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat"
                :disabled="!valid" :loading="loading">
                {{ $t("user.sign-up") }}
            </v-btn>

            <ErrorAlert v-if="invalidInputError" :error="invalidInputError" />
            <ErrorAlert v-if="serverError" :error="serverError" />
            <ErrorAlert v-if="incorrectRepeatPass" :error="incorrectRepeatPass" />

            <div class="text-center mt-8">
                <p class="mb-6">{{ $t("create-account.sso") }}</p>
                <v-btn icon="mdi-facebook" size="small" variant="flat" color="#405189" class="mx-1"></v-btn>
                <v-btn icon="mdi-google" size="small" variant="flat" color="#f06548" class="mx-1"></v-btn>
                <v-btn icon="mdi-github" size="small" variant="flat" color="#212529" class="mx-1"></v-btn>
                <v-btn icon="mdi-twitter" size="small" variant="flat" color="#299cdb" class="mx-1"></v-btn>
                <div class="mt-8">
                    {{ $t("user.have-account") }}
                    <router-link
                        :to="{ name: 'login', query: { redirect: $route.query.redirect }, params: { lang: $vuetify.locale.current } }"
                        class="link text-primary">{{ $t("user.sign-in") }}</router-link>
                </div>
            </div>
        </v-form>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/store/auth";
import { useAPI } from "@/api";
import ErrorAlert from "@/components/ErrorAlert.vue"
import { IErrorInComponent } from "@/utilities/error";
import InvalidInputResponse from "@/api/errors/InvalidInputResponse";

export default defineComponent({
    components: {
        ErrorAlert
    },
    data() {
        return {
            valid: false,
            password: "",
            checkbox: false,
            name: "",
            phone: "",
            email: "",
            username: "",
            repeartPassword: "",
            loading: false,
            serverError: undefined as undefined | IErrorInComponent,
            invalidInputError: undefined as undefined | IErrorInComponent,
            incorrectRepeatPass: undefined as undefined | IErrorInComponent,
            errors: undefined as undefined | Record<string, string[]>
        };
    },
    methods: {
        async onSubmit() {
            if (this.password !== this.repeartPassword) {
                this.incorrectRepeatPass = {
                    message: this.$t('password.confirm-password.not-matching')
                };
                return;
            } else {
                this.incorrectRepeatPass = undefined;
            }
            this.serverError = undefined;
            this.invalidInputError = undefined;
            if (this.loading) {
                return;
            }
            this.loading = true;
            try {
                const response = await useAPI().register({
                    name: this.name,
                    cellphone: this.phone,
                    email: this.email,
                    password: this.password,
                });

                const authStore = useAuthStore();
                authStore.setUser(response.user);
                authStore.setToken(response.token)
                const redirect = this.$route.query.redirect;
                if (redirect && typeof redirect == "string") {
                    this.$router.push({ path: redirect })
                } else {
                    this.$router.push({ name: "dashboard" })
                }
            }
            catch (e) {
                if (e instanceof InvalidInputResponse) {
                    this.errors = e.errors;
                }
                else {
                    this.serverError = {
                        message: this.$t('server error')
                    };
                }

            }
            finally {
                this.loading = false;
            }
        },
        nameValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("user.name.required");
            }
            return true;
        },
        phoneChanged() {
            if (this.errors){
                this.errors.cellphone = [];
            }
        },
        emailChanged() {
            if (this.errors) {
                this.errors.email = [];
            }
        },
        phoneValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("user.phone-number.required");
            }
            if (!/^0\d{10}$/.test(value)) {
                return this.$t("invalid.user.phone-number");
            }
            return true;
        },
        emailValidation(value: string): boolean | string {
            if (!value) {
                return this.$t("user.email.required");
            }
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)) {
                return this.$t("invalid.email");
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
                return this.$t("user.password-confirmation.required");
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
</style>@/api/errors/InvalidInputResponse