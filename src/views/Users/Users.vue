<template>
    <v-container class="users-list">
        <v-card class="pa-sm-5 pa-3" flat v-if="!loading && !error">
            <v-row class="mb-3">
                <v-col sm="6" cols="12">
                    <h1 :class="$vuetify.display.xs ? 'text-center' : $vuetify.locale.isRtl ? 'text-right' : 'text-left'">
                        {{ $t('users') }}
                    </h1>
                </v-col>
                <v-col sm="6" cols="12" v-if="response"
                    :align="$vuetify.display.xs ? 'center' : $vuetify.locale.isRtl ? 'left' : 'right'" class="my-auto">
                    <SearchUser :userTypes="response.types" @submit="onSearchUser" />
                    <v-btn :to="{ name: 'addUser' }" variant="flat" color="customGreen" prependIcon="mdi-plus" class="ms-3"
                        width="110px">{{
                            $t("user.add") }}
                    </v-btn>
                </v-col>
            </v-row>
            <v-data-table @update:options="onLoadTableItems" :headers="headers" :items="response?.data"
                :items-per-page-options="[
                    { value: 5, title: '5' },
                    { value: 10, title: '10' },
                    { value: 20, title: '20' },
                    { value: -1, title: $t('all') }
                ]" v-model:items-per-page="ipp" :items-per-page-text="$t('items per page')" pageText=""
                show-current-page :no-data-text="$t('search.no-data')">

                <template v-slot:item.status="{ value }">
                    <v-chip :color="backgroundOfStatus(value)">
                        {{ $t('user.status.' + value) }}
                    </v-chip>
                </template>
                <template v-slot:item.meta.avatar="{ value }">
                    <v-img :src="value || '/pics/default-avatar.jpg'" class="rounded-circle my-2" width="45px"
                        height="45px"></v-img>
                </template>
                <template v-slot:item.type_id="{ value }">
                    {{ getType(value)?.title || "-" }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <TableRowActions :tableRowAction="tableRowAction(item)" :user="item.id" />
                </template>
            </v-data-table>
        </v-card>
        <div class="text-center my-10">
            <v-progress-circular v-if="loading" indeterminate color="primary" />
        </div>
        <ErrorAlert v-if="error" :error="error" />
    </v-container>
</template>
<script lang="ts">
import { useAPI } from "@/api"
import TableRowActions from "@/components/TableRowActions.vue"
import SearchUser from "@/components/SearchUser.vue"
import { ILocalizedUserType, IUser, IUserType, UserStatus } from "@/api/authentication"
import { persianNumber } from "@/utilities"
import { ISearchUserRequest, ISearchUserResponse } from "@/api/users"
import NotFoundError from "@/api/errors/NotFoundError"
import { IErrorInComponent } from "@/utilities/error";
import BaseError from "@/api/errors/BaseError"
import ErrorAlert from "@/components/ErrorAlert.vue"

export default {
    components: {
        TableRowActions,
        SearchUser,
        ErrorAlert
    },
    setup() {
        return {
            persianNumber
        }
    },
    data() {
        return {
            response: undefined as ISearchUserResponse | undefined,
            error: undefined as undefined | IErrorInComponent,
            loading: true,
            ipp: 5
        }
    },
    methods: {
        backgroundOfStatus(status: UserStatus) {
            if (status === UserStatus.ACTIVE) {
                return "green"
            } else if (status == UserStatus.SUSPENDED) {
                return "red"
            }
        },
        tableRowAction(user: IUser) {
            return [
                {
                    title: this.$t("user.show"),
                    value: "show",
                    props: {
                        prependIcon: "mdi-file-document-multiple-outline",
                        color: "green",
                        to: { name: `showUser`, params: { id: user.id } },
                    }
                },
                {
                    title: this.$t("user.edit"),
                    value: "edit",
                    props: {
                        prependIcon: "mdi-note-edit-outline",
                        color: "blue",
                        to: { name: `editUser`, params: { id: user.id } },
                    }

                },
                {
                    title: this.$t("user.delete"),
                    value: "delete",
                    props: {
                        prependIcon: "mdi-close-thick",
                        color: "red",

                        to: { name: `deleteUser`, params: { id: user.id } },
                    }

                }
            ]
        },
        onSearchUser(request: ISearchUserRequest) {
            this.$router.push({
                name: this.$route.name as string, query: {
                    id: request.id,
                    name: request.name,
                    status: request.status,
                    type_id: request.type_id
                }
            });
        },
        async searchUser(request: ISearchUserRequest) {
            this.loading = true;
            this.error = undefined;
            this.response = undefined;
            try {
                this.response = await useAPI().searchUsers(request);
            } catch (e) {
                if (e instanceof BaseError) {
                    this.error = e.toComponentError();
                } else {
                    this.error = {
                        message: this.$t('server error')
                    };
                }
            } finally {
                this.loading = false;
            }
        },
        onLoadTableItems(options: { page: number, itemsPerPage: number, sortBy: string }) {
            this.$router.push({
                name: this.$route.name as string,
                query: Object.assign({}, this.$route.query, { ipp: options.itemsPerPage, page: options.page })
            });
        },
        getType(typeId: number): ILocalizedUserType | undefined {
            return this.response?.types.find((type) => type.id === typeId);
        },
    },
    created() {
        this.$watch(
            () => this.$route.query,
            () => {
                this.searchUser({
                    id: this.$route.query.id ? parseInt(this.$route.query.id as string) : undefined,
                    name: this.$route.query.name ? this.$route.query.name as string : undefined,
                    status: this.$route.query.status ? this.$route.query.status as string : undefined,
                    type_id: this.$route.query.type_id ? parseInt(this.$route.query.type_id as string) : undefined,
                    ipp: this.$route.query.ipp ? parseInt(this.$route.query.ipp as string) : undefined,
                })
            },
            { immediate: true }
        )
    },
    computed: {
        headers() {
            return [
                { key: 'id', sortable: false, title: this.$t("user.id") },
                { key: 'meta.avatar', sortable: false, title: this.$t("user.avatar") },
                { key: 'name', sortable: false, title: this.$t("user.name") },
                { key: 'status', sortable: false, title: this.$t("user.status") },
                { key: 'type_id', sortable: false, title: this.$t("user.role") },
                { key: 'actions', sortable: false },
            ]
        }
    }
}
</script>
<style>
.users-list {
    .v-table>.v-table__wrapper>table>tbody>tr>td,
    .v-table>.v-table__wrapper>table>tbody>tr>th,
    .v-table>.v-table__wrapper>table>thead>tr>td,
    .v-table>.v-table__wrapper>table>thead>tr>th{
        padding: 0 8px;
    }
    .v-data-table-footer{
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        .v-data-table-footer__items-per-page{
            padding-right: 0px;

        }
    }        
}
</style>
