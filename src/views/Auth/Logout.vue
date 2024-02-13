<template>
    <v-img width="100px" class="rounded-pill mx-auto my-4" :src="avatar"></v-img>
    <h2 class="text-center font-weight-bold">{{ username }}</h2>
    <div class="my-2">{{ $t("user.logout-successful") }}</div>
    <div class="my-2">
        <div>
            <vue-countdown class="text-primary" :time="20 * 1000" v-slot="{ seconds }">
                <h2>{{ $vuetify.locale.isRtl ? persianNumber(seconds) : seconds }}</h2>
            </vue-countdown>
        </div>
        <div>{{ $t("you will be redirected to the login page in a few seconds") }}</div>
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
        this.authStore.setUser(undefined);
        setTimeout(() => { this.$router.push({ name: "login" , params: { lang: this.$vuetify.locale.current } }); }, 20000);
    }
});
</script>