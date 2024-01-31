<template>
    <div class="one-user-info" v-if="!loading && !serverError">
        <div class="banner">
            <div class="bg-overlay"></div>
        </div>
        <v-container>
            <v-card class="img-card pa-4 text-center" elevation="1">
                <v-img :src="user.avatar || '/pics/default-avatar.jpg'" class="rounded-circle my-2 mx-auto user-avatar" width="120px" height="120px"></v-img>
                <h2 class="text-textColor">{{ user.name }}</h2>
                <div class="text-secondary">{{ user.role }}</div>
            </v-card>
        </v-container>
    </div>
    <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-alert v-if="serverError" :text="$t('server error')" type="error" variant="tonal"></v-alert>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useAPI } from "@/api"
import { IUser } from '@/api/authentication';

export default defineComponent({
    data() {
        return {
            user: {} as IUser,
            serverError: false,
            loading: true,
        }
    },
    async mounted() {
        try {
            const response = await useAPI().getUser(parseInt(this.$route.params.id.toString()));
            this.user = response.user;
        }
        catch {
            this.serverError = true;
        }
        finally {
            this.loading = false;
        }
    }
})
</script>
<style lang="scss">
.one-user-info {
    .banner {
        background-image: url("@/assets/pics/defaultBanner.jpg");
        background-repeat: no-repeat;
        background-size: cover;
        height: 320px;
        background-position: top;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 0px;
        margin: 0px;
        z-index: 0;
    }

    .bg-overlay {
        background: linear-gradient(90deg, #364574, #405189);
        opacity: 0.9;
        height: 320px;
    }

    .img-card {
        position: relative;
        top: 180px;
    }
    .user-avatar{
        border: 5px solid rgb(var(--v-theme-secondary),0.2);
    }
}
</style>
