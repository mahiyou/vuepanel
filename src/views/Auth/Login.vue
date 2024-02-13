<template>
    <v-container class="login">
        <div class="text-primary title">{{ $t("welcome") }}</div>
        <div class="sub-title mt-2 text-secondary">{{ $t("user.signin.signin to continue") }}</div>
        <v-form @submit.prevent="onSubmit" v-model="valid" class="text-start">
            <div class="mt-9 mb-2">{{ $t("username(email or cell phone)") }}</div>
            <v-text-field variant="outlined" v-model="username" dir="ltr" :rules="[usernameValidation]" />
            <v-row class="mt-2">
                <v-col cols="6">
                    <div class="mb-2">{{ $t("user.password") }}</div>
                </v-col>
                <v-col cols="6" class="">
                    <router-link
                        :to="{ name: 'resetPassword', query: { redirect: $route.query.redirect }, params: { lang: $vuetify.locale.current } }"
                        class="link text-secondary text-decoration-none float-end">{{ $t("user.login.forget password") }}</router-link>
                </v-col>
            </v-row>

            <v-text-field variant="outlined" v-model="password" dir="ltr" :rules="[passwordValidation]" />

            <v-checkbox color="primary" v-model="checkbox" :label="$t('user.login.remember me')" class="checkbox"></v-checkbox>

            <v-btn class="px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat" :loading="loading"
                :disabled="!valid">
                {{ $t('user.sign-in') }}
            </v-btn>

            <ErrorAlert v-if="invalidInputError" :error="invalidInputError" />
            <ErrorAlert v-if="serverError" :error="serverError" />

            <div class="text-center mt-8">
                <p class="mb-6">{{ $t('sign-in.sso') }}</p>
                <v-btn icon="mdi-facebook" size="small" variant="flat" color="#405189" class="mx-1"></v-btn>
                <v-btn icon="mdi-google" size="small" variant="flat" color="#f06548" class="mx-1"></v-btn>
                <v-btn icon="mdi-github" size="small" variant="flat" color="#212529" class="mx-1"></v-btn>
                <v-btn icon="mdi-twitter" size="small" variant="flat" color="#299cdb" class="mx-1"></v-btn>
                <div class="mt-8">
                    {{ $t('user.no-account') }}
                    <router-link
                        :to="{ name: 'register', query: { redirect: $route.query.redirect }, params: { lang: $vuetify.locale.current } }"
                        class="link text-primary">{{ $t('user.sign-up') }}</router-link>
                </div>
            </div>
        </v-form>
    </v-container>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/store/auth";
import { useNotificationStore } from "@/store/notification";
import { useAPI } from "@/api";
import UserLoginError from "@/api/errors/UserLoginError";
import { IErrorInComponent } from "@/utilities/error";
import ErrorAlert from "@/components/ErrorAlert.vue"
import BaseError from "@/api/errors/BaseError";

export default defineComponent({
    components: {
        ErrorAlert
    },
    setup() {
        return {
            authStore: useAuthStore(),
            notificationStore: useNotificationStore()
        };
    },
    data() {
        return {
            valid: false,
            username: "",
            password: "",
            checkbox: false,
            loading: false,
            invalidInputError: undefined as undefined | IErrorInComponent,
            serverError: undefined as undefined | IErrorInComponent,
        };
    },
    methods: {
        async onSubmit() {
            if (this.loading) {
                return;
            }
            this.loading = true;
            this.serverError = undefined;
            this.invalidInputError = undefined;
            try {
                const response = await useAPI().login({ username: this.username, password: this.password });
                this.authStore.setUser(response.user);
                this.notificationStore.set(response.notifications);
                console.log(this.$vuetify.locale.current);
                const redirect = this.$route.query.redirect;
                if (redirect && typeof redirect == "string") {
                    this.$router.push({ path: redirect });
                } else {
                    this.$router.push({ name: "dashboard" });
                }
            } catch (e) {
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
            } finally {
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