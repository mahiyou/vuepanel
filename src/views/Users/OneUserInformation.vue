<template>
    <div class="one-user-info" v-if="!loading && !serverError">
        <div class="banner">
            <div class="bg-overlay"></div>
        </div>
        <v-container class="pb-15">
            <div class="img-card pb-15">
                <v-card class="pa-4 text-center" elevation="1">
                    <v-img :src="user.avatar || '/pics/default-avatar.jpg'" class="rounded-circle my-2 mx-auto user-avatar"
                        width="120px" height="120px"></v-img>
                    <h2 class="text-textColor">{{ user.name }}</h2>
                    <div class="text-secondary">{{ user.role }}</div>
                </v-card>
                <v-card class="pa-3 my-4">
                    <v-tabs v-model="tab" color="primary" align-tabs="start">
                        <v-tab :value="1">{{ $t("personal details") }}</v-tab>
                        <v-tab :value="2">{{ $t("change password") }}</v-tab>
                    </v-tabs>
                    <v-window v-model="tab" class="mb-15">
                        <v-window-item :value="1">
                            <v-container>
                                <v-form @submit.prevent="onSubmit" class="my-6">
                                    <v-row>
                                        <v-col cols="6">
                                            <div>{{ $t("name") }}</div>
                                            <v-text-field variant="outlined" v-model="name" dir="ltr" />

                                            <div>{{$t("phone number") }}</div>
                                            <v-text-field variant="outlined" v-model="phoneNumber" dir="ltr" />
                                        </v-col>
                                        <v-col cols="6">
                                            <div>{{ $t("role") }}</div>
                                            <v-text-field variant="outlined" v-model="role" dir="ltr" />

                                            <div>{{ $t("email address") }}</div>
                                            <v-text-field variant="outlined" v-model="email" dir="ltr" />
                                        </v-col>
                                    </v-row>
                                    <div>{{ $t("joining date") }}</div>
                                    <v-text-field variant="outlined" v-model="joiningDate" dir="ltr" />
                                    <v-row>
                                        <v-col>
                                            <div>{{ $t("city") }}</div>
                                            <v-text-field variant="outlined" v-model="city" dir="ltr" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("country") }}</div>
                                            <v-text-field variant="outlined" v-model="country" dir="ltr" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("zip code") }}</div>
                                            <v-text-field variant="outlined" v-model="zipCode" dir="ltr" />
                                        </v-col>
                                    </v-row>
                                    <v-btn type="submit" class="px-5 float-end" color="primary"
                                        variant="flat">{{ $t("updates") }}</v-btn>
                                </v-form>
                            </v-container>
                        </v-window-item>
                        <v-window-item :value="2">
                            <v-container>
                                <v-form @submit.prevent="onSubmitChangPassword" class="my-6">
                                    <v-row>
                                        <v-col>
                                            <div>{{ $t("old password") }}*</div>
                                            <v-text-field variant="outlined" v-model="oldPass" dir="ltr" />
                                            <a class="text-primary" href="/">{{ $t("forgot your password?") }}</a>
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("new password") }}*</div>
                                            <v-text-field variant="outlined" v-model="newPass" dir="ltr" />
                                        </v-col>
                                        <v-col>
                                            <div>{{ $t("confirm password")}}*</div>
                                            <v-text-field variant="outlined" v-model="confirmPass" dir="ltr" />
                                        </v-col>
                                    </v-row>
                                    <v-btn type="submit" class="px-5 mt-2 float-end" color="customGreen"
                                        variant="flat">{{ $t("reset password") }}</v-btn>
                                </v-form>
                            </v-container>
                        </v-window-item>
                    </v-window>
                </v-card>
            </div>
        </v-container>
    </div>
    <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-alert class="mx-4" v-if="serverError" :text="$t('server error')" type="error" variant="tonal"></v-alert>
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
            tab: 1,
            name: "",
            phoneNumber: "",
            role: "",
            email: "",
            city: "",
            country: "",
            zipCode: "",
            oldPass: "",
            newPass: "",
            confirmPass: "",
            joiningDate: "",
        }
    },
    methods: {
        onSubmit() { },
        onSubmitChangPassword() { }
    },
    async mounted() {
        try {
            const response = await useAPI().getUser(parseInt(this.$route.params.id.toString()));
            this.user = response.user;
            this.name = this.user.name || "";
            this.phoneNumber = this.user.phoneNumber || "";
            this.role = this.user.role || "";
            this.email = this.user.email || "";
            this.city = this.user.city || "";
            this.country = this.user.country || "";
            this.zipCode = this.user.zipCode || "";
            this.joiningDate = this.user.joiningDate || "";
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

    .user-avatar {
        border: 5px solid rgb(var(--v-theme-secondary), 0.2);
    }
}
</style>
