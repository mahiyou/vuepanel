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
                    <v-btn variant="flat" color="secondary" class="ms-3 mb-3" width="130px" :to="{ name: 'users' }">{{
                        $t("cancel") }}</v-btn>
                </div>
                <div v-if="userDeleted">
                    <h3 class="text-red my-4">{{ $t("user deleted successfully") }}</h3>
                    <v-btn variant="flat" color="secondary" class="ms-3 mb-3" width="220px" :to="{ name: 'users' }">{{
                        $t("go to the user list page") }}</v-btn>
                </div>
                <ErrorAlert v-if="serverError" :error="serverError" />
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
import BaseError from "@/api/errors/BaseError";
import ErrorAlert from "@/components/ErrorAlert.vue"
import { IErrorInComponent } from '@/utilities/error';

export default defineComponent({
    components: {
        ErrorAlert
    },
    data() {
        return {
            user: {} as IUser,
            serverError: undefined as undefined | IErrorInComponent,
            loading: true,
            loadingDelete: false,
            userDeleted: false,
        }
    },
    methods: {
        async deleteUser(id: number) {
            this.loadingDelete = true;
            this.serverError = undefined;
            try {
                await useAPI().deleteUser(id);
                this.userDeleted = true;
            }
            catch (e) {
                if (e instanceof BaseError) {
                    this.serverError = e.toComponentError();
                } else {
                    this.serverError = {
                        message: this.$t('server error')
                    };
                }
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
        catch(e) {
            if (e instanceof BaseError) {
                this.serverError = e.toComponentError();
            } else {
                this.serverError = {
                    message: this.$t('server error')
                };
            }
        }
        finally {
            this.loading = false;
        }
    }
})

</script>