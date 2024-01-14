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
        <v-alert class="my-2" v-if="incorrectRepeatPass" :text="$t('password and confirm password')" type="error"
            variant="tonal"></v-alert>
    </v-form>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        loading: Boolean,
    },
    data() {
        return {
            valid: false,
            password: "",
            repeartPassword: "",
            incorrectRepeatPass: false,
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
                this.incorrectRepeatPass = true;
                return;
            }else{
                this.incorrectRepeatPass = false;
            }
            this.$emit("changePass",this.password);

        }
    }
});
</script>