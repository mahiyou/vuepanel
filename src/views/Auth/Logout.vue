<template>
    <v-img width="100px" class="rounded-pill mx-auto my-4" :src="avatar"></v-img>
    <h2 class="text-center font-weight-bold">{{ username }} عزیز</h2>
    <div class="my-2"> با موفقیت از حساب کاربری خود خارج شدید.</div>
    <div class="my-2">
        <span>تا </span>
        <vue-countdown class=" bg-primary px-2 py-1 rounded" :time="20 * 1000" v-slot="{ seconds }">
            {{ persianNumber(seconds) }}
        </vue-countdown>
        <span> ثانیه دیگر به صفحه ی ورود منتقل می شوید.</span>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "@/store/auth";
import { persianNumber } from "@/utilities";

export default defineComponent({
    setup() {
        return {
            authStore: useAuthStore(),
            persianNumber,
        };
    },
    data() {
        return {
            username: "",
            avatar: "",
        };
    },
    mounted() {
        this.username = this.authStore.user ? this.authStore.user.name ? this.authStore.user.name : "کاربر" : "";
        this.avatar = this.authStore.user ? this.authStore.user.avatar ? this.authStore.user.avatar : "/pics/default-avatar.jpg" : "";
        this.authStore.user = undefined;
        setTimeout(() => { this.$router.push({ name: "login" , params: { lang: this.$vuetify.locale.current } }); }, 20000);
    }
});
</script>