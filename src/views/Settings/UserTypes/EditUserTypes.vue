<template>
    <v-container>
        <v-card v-if="!loading && !error" class="pa-sm-5 pa-3" flat>
            <h1 class="mb-6">ویرایش سطح کاربری</h1>
            <v-row v-if="userType?.translates" v-for="title in Object.keys(userType?.translates)">
                <v-col cols="2">
                    <h3 class="float-end">عنوان به زبان {{ title }}</h3>
                </v-col>
                <v-col cols="4">
                    <v-text-field variant="outlined" v-model="userType.translates[title].title"
                        :dir="$vuetify.locale.current" />
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="6">
                    <v-expansion-panels>
                        <v-expansion-panel title="دسترسی ها" elevation="2">
                            <v-expansion-panel-text>
                                <v-list select-strategy="classic">
                                    <v-list-item v-for="ability, index in authStore.user?.type.abilities" :key="index"
                                        :value="ability">
                                        <template v-slot:prepend="{ isActive }">
                                            <v-list-item-action start>
                                                <v-checkbox-btn v-model="checkedAbilities[index]"></v-checkbox-btn>
                                            </v-list-item-action>
                                        </template>
                                        <v-list-item-title>{{ ability }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
                <v-col cols="6">
                    <v-expansion-panels>
                        <v-expansion-panel title="سطوح زیرمجموعه" elevation="2">
                            <v-expansion-panel-text>
                                <v-list select-strategy="classic">
                                    <v-list-item v-for="children, index in authStore.user?.type.children" :key="index"
                                        :value="children">
                                        <template v-slot:prepend="{ isActive }">
                                            <v-list-item-action start>
                                                <v-checkbox-btn v-model="checkedChildren[index]"></v-checkbox-btn>
                                            </v-list-item-action>
                                        </template>
                                        <v-list-item-title>{{ getUserTypeTilte(children) }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
            <div class=" text-center">
                <v-btn color="primary" width="40%" class="mt-12 mb-5">{{
            $t('update') }}</v-btn>
            </div>
        </v-card>
        <div class="text-center my-10">
            <v-progress-circular v-if="loading" indeterminate color="primary" />
        </div>
        <ErrorAlert v-if="error" :error="error" />
    </v-container>
</template>
<script lang="ts">
import { useAPI } from '@/api';
import { IMultilanguageUserType } from '@/api/authentication';
import BaseError from '@/api/errors/BaseError';
import { ISearchUserTypeResponse } from '@/api/users';
import { useAuthStore } from '@/store/auth';
import { IErrorInComponent } from '@/utilities/error';
import { defineComponent } from 'vue';
import { ILocalizedUserType } from '@/api/authentication';

export default defineComponent({
    setup() {
        return {
            authStore: useAuthStore(),
        }
    },
    data() {
        return {
            userType: undefined as undefined | IMultilanguageUserType,
            userTypes: undefined as undefined | ISearchUserTypeResponse,
            title: [],
            loading: true,
            error: undefined as undefined | IErrorInComponent,
            checkedChildren: [] as boolean[],
            checkedAbilities: [] as boolean[],
        }
    },
    async created() {
        this.$watch(
            () => this.$route.params,
            async () => {
                this.loading = true;
                try {
                    const response = await useAPI().getUserType(parseInt(this.$route.params.id.toString()));
                    this.userType = response.data;
                    this.setAbilities();
                    this.setChildren();
                }
                catch (e) {
                    if (e instanceof BaseError) {
                        this.error = e.toComponentError();
                    } else {
                        this.error = {
                            message: this.$t('server error')
                        };
                    }
                }
                finally {
                    this.loading = false;
                }

                try {
                    const response = await useAPI().searchUserTypes({});
                    this.userTypes = response;
                }
                catch (e) {
                    if (e instanceof BaseError) {
                        this.error = e.toComponentError();
                    } else {
                        this.error = {
                            message: this.$t('server error')
                        };
                    }
                }
                finally {
                    this.loading = false;
                }
            },
            { immediate: true }
        )
    },
    methods: {
        setAbilities() {
            console.log(this.userType?.abilities)
            console.log(this.authStore.user?.type.abilities)
            if (this.authStore.user?.type.abilities) {
                for (let i = 0; i < this.authStore.user?.type.abilities.length; i++) {
                    let findAbility = false;
                    if (this.userType?.abilities) {
                        for (let j = 0; j < this.userType?.abilities.length && !findAbility; j++) {
                            if (this.authStore.user?.type.abilities[i] === this.userType?.abilities[j]) {
                                findAbility = true;
                            }
                        }
                    }
                    this.checkedAbilities.push(findAbility);
                }
            }

        },
        getUserTypeTilte(userTypeID: number): string {
            const userType = this.userTypes?.data.find((userType) => userType.id === userTypeID) as ILocalizedUserType | undefined
            return userType ? userType.title : '';
        },
        setChildren() {
            if (this.authStore.user?.type.children) {
                for (let i = 0; i < this.authStore.user?.type.children.length; i++) {
                    let findChild = false;
                    if (this.userType?.children) {
                        for (let j = 0; j < this.userType?.children.length && !findChild; j++) {
                            if (this.authStore.user?.type.abilities[i] === this.userType?.abilities[j]) {
                                findChild = true;
                            }
                        }
                    }
                    this.checkedChildren.push(findChild);
                }
            }
        },
    },
})
</script>
<style lang="scss">
.v-expansion-panel-text__wrapper {
    max-height: 300px;
    overflow-y: scroll;
}
</style>