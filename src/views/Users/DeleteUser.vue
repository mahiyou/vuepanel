<template>
    <div class="edit-user" v-if="!loading && !serverError">
        <v-container class="pb-15">
            <v-card class="pa-4 text-center" elevation="1">
                <v-img :src="user.avatar || '/pics/default-avatar.jpg'" class="rounded-circle my-2 mx-auto user-avatar"
                    width="120px" height="120px"></v-img>
                <h2 class="text-textColor">{{ user.name }}</h2>
                <div class="text-secondary mb-5">{{ user.role }}</div>
                <div v-if="!userDeleted">
                    <v-btn variant="flat" color="red" width="130px" class="mb-3" :loading="loadingDelete"
                        @click="deleteUser(user.id)">{{ $t("delete user") }}</v-btn>
                    <v-btn variant="flat" color="secondary" class="ms-3 mb-3" width="130px"
                        :to="{ name: 'users' }">{{ $t("cancel") }}</v-btn>
                </div>
                <div v-if="userDeleted">
                    <h3 class="text-red my-4">{{ $t("user deleted successfully") }}</h3>
                    <v-btn variant="flat" color="secondary" class="ms-3 mb-3" width="220px"
                        :to="{ name: 'users' }">{{ $t("go to the user list page") }}</v-btn>
                </div>

                <v-alert class="mx-4" v-if="serverError" :text="$t('server error')" type="error" variant="tonal"></v-alert>
            </v-card>
        </v-container>
    </div>
    <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
</template>
<script lang="ts">
import { useAPI } from '@/api';
import { IUser } from '@/api/authentication';
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
            user: {} as IUser,
            serverError: false,
            loading: true,
            loadingDelete: false,
            userDeleted: false,
        }
    },
    methods: {
        async deleteUser(id: number) {
            this.loadingDelete = true;
            this.serverError = false;
            try {
                await useAPI().deleteUser(id);
                this.userDeleted = true;
            }
            catch {
                this.serverError = true;
            }
            finally {
                this.loadingDelete = false;
            }
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