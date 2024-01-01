<template>
    <v-form @submit.prevent="$emit('submit', username)" v-model="valid" class="text-right">
        <div class="mb-2">نام کاربری (ایمیل و یا شماره موبایل)</div>
        <v-text-field variant="outlined" v-model="username" dir="ltr" :rules="[usernameValidation]" />
        <v-btn class="mt-2 px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat" :disabled="!valid"
            :loading="loading">
            تنظیم مجدد رمز عبور
        </v-btn>
    </v-form>
    <div class="mt-8">
        رمز عبور خود را به یاد اوردید؟
        <router-link :to="{ name: 'login' }" class="link text-primary">اینجا کلیک کنید</router-link>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            valid: false,
            username: "",
        };
    },
    props:{
        loading: Boolean,
    },
    methods: {
        usernameValidation(value: string): boolean | string {
            if (!value) {
                return "وارد کردن نام کاربری الزامی است.";
            }
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) && !/^0\d{10}$/.test(value)) {
                return "نام کاربری وارد شده معتبر نیست.";
            }
            return true;
        },
    }
});
</script>