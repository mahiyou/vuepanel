<template>
    <v-form @submit.prevent="$emit('submit', username)" v-model="valid" class="text-start">
        <div class="mb-2">{{ $t("username(email or cell phone)") }}</div>
        <v-text-field variant="outlined" v-model="username" dir="ltr" :rules="[usernameValidation]" />
        <v-btn class="mt-2 px-2 submit-btn" width="100%" type="submit" color="customGreen" variant="flat" :disabled="!valid"
            :loading="loading">
           {{ $t("reset password") }}
        </v-btn>
    </v-form>
    <div class="mt-8">
        {{ $t("remember my password") }}
        <router-link :to="{ name: 'login' }" class="link text-primary">{{ $t("click here") }}</router-link>
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
                return this.$t("username is necessary");
            }
            if (!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value) && !/^0\d{10}$/.test(value)) {
                return this.$t("inputed username is invalid");
            }
            return true;
        },
    }
});
</script>