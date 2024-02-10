<template>
    <v-form @submit.prevent="onSubmit" v-model="valid" class="text-start">
        <div class="my-1">{{ $t("enter your new password") }}</div>
        <div class="mt-2 mb-2">{{ $t("password") }}<span class="text-red"> *</span></div>
        <v-text-field variant="outlined" v-model="password" dir="ltr" :rules="[passwordValidation]" />

        <div class="mt-2 mb-2">{{ $t("confirm password") }}<span class="text-red"> *</span></div>
        <v-text-field variant="outlined" v-model="repeartPassword" dir="ltr" :rules="[repeatPasswordValidation]" />
        <v-btn class="mt-6 px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat" :disabled="!valid"
            :loading="loading">
            {{ $t("reset password") }}
        </v-btn>
        <ErrorAlert v-if="error" :error="error" />
    </v-form>
</template>
<script lang="ts">
import { IErrorInComponent } from "@/utilities/error";
import { defineComponent } from "vue";
import ErrorAlert from "@/components/ErrorAlert.vue";

export default defineComponent({
    components: {
        ErrorAlert
    },
    props: {
        loading: Boolean,
    },
    data() {
        return {
            valid: false,
            password: "",
            repeartPassword: "",
            error: undefined as undefined | IErrorInComponent,
        };
    },
    methods: {
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
        onSubmit() {
            if (this.password !== this.repeartPassword) {
                this.error = {
                    message: this.$t('password and confirm password')
                };
                return;
            } else {
                this.error = undefined;
            }
            this.$emit("changePass", this.password);

        }
    }
});
</script>