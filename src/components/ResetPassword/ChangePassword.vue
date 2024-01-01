<template>
    <v-form @submit.prevent="onSubmit" v-model="valid" class="text-right">
        <div class="my-1">رمز عبور جدید خود را وارد کنید.</div>
        <div class="mt-2 mb-2">رمز عبور<span class="text-red"> *</span></div>
        <v-text-field variant="outlined" v-model="password" dir="ltr" :rules="[passwordValidation]" />

        <div class="mt-2 mb-2">تکرار رمز عبور<span class="text-red"> *</span></div>
        <v-text-field variant="outlined" v-model="repeartPassword" dir="ltr" :rules="[repeatPasswordValidation]" />
        <v-btn class="mt-6 px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat" :disabled="!valid"
            :loading="loading">
            تغییر رمز عبور
        </v-btn>
        <v-alert class="my-2" v-if="incorrectRepeatPass" text="تکرار رمز عبور با رمز یکسان نیست" type="error"
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
                return "وارد کردن رمز عبور الزامی است.";
            }
            return true;
        },
        repeatPasswordValidation(value: string): boolean | string {
            if (!value) {
                return "وارد کردن تکرار رمز عبور الزامی است.";
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