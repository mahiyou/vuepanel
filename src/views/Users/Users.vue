<template>
    <v-container>
        <v-card class="pa-3" flat v-if="!loading && !error">
            <v-toolbar color="white">
                <v-toolbar-title class="text-h5">
                    {{ $t('users') }}
                </v-toolbar-title>
                <template v-slot:append>
                    <SearchUser @searchUser="onSearchUser" />
                </template>
            </v-toolbar>
            <v-data-table :headers="headers" :items="users" :items-per-page-options="[
                { value: 5, title: '5' },
                { value: 10, title: '10' },
                { value: 20, title: '20' },
                { value: -1, title: $t('all') }
            ]" :items-per-page-text="$t('items per page')" pageText="" show-current-page :no-data-text="$t('no data')">
                <template v-slot:item.status="{ value }">
                    <v-chip :color="backgroundOfStatus(value)">
                        {{ value }}
                    </v-chip>
                </template>
                <template v-slot:item.avatar="{ value }">
                    <v-img :src="value || '/pics/default-avatar.jpg'" class="rounded-circle my-2" width="45px"
                        height="45px"></v-img>
                </template>
                <template v-slot:item.role="{ value }">
                    {{ value }}
                </template>
                <template v-slot:item.actions="{ item }">
                    <TableRowActions :tableRowAction="tableRowAction(item)" :user="item.id"/>
                </template>
            </v-data-table>
        </v-card>
        <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate color="primary"></v-progress-circular></div>
        <ErrorAlert v-if="error" :error="error" />
    </v-container>
</template>
<script lang="ts">
import { useAPI } from "@/api"
import TableRowActions from "@/components/TableRowActions.vue"
import SearchUser from "@/components/SearchUser.vue"
import { IUser, Role, Status } from "@/api/authentication"
import { persianNumber } from "@/utilities"
import { ISearchUserRequest } from "@/api/users"
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
            users: [] as IUser[] | undefined,
            error: undefined as undefined | IErrorInComponent,
            loading: true,
        }
    },
    methods: {
        backgroundOfStatus(status: Status) {
            if (status === Status.ACTIVE) {
                return "green"
            } else if (status == Status.SUSPENDED) {
                return "red"
            }
        },
        tableRowAction(user: IUser) {
            return [
                {
                    title: this.$t("show"),
                    value: "show",
                    props: {
                        prependIcon: "mdi-file-document-multiple-outline",
                        color: "green",
                        to: { name: `showUser`, params: { id: user.id } },
                    }
                },
                {
                    title: this.$t("edit"),
                    value: "edit",
                    props: {
                        prependIcon: "mdi-note-edit-outline",
                        color: "blue",
                        to: { name: `editUser`, params: { id: user.id } },
                    }

                },
                {
                    title: this.$t("delete"),
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
                    role: request.role,
                }
            });
        },
        async searchUser(user: ISearchUserRequest) {
            this.loading = true;
            this.users = [];
            try {
                const response = await useAPI().searchUsers({
                    id: user.id || undefined,
                    name: user.name || undefined,
                    status: user.status || undefined,
                    role: user.role || undefined
                });
                this.users = response.users;
                
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
        }
    },
    created() {
        this.$watch(
            () => this.$route.query,
            () => {
                this.searchUser({
                    id: this.$route.query.id ? parseInt(this.$route.query.id.toString()) : undefined,
                    name: this.$route.query.name ? this.$route.query.name.toString() : undefined,
                    status: this.$route.query.status ? this.$route.query.status.toString() : undefined,
                    role: this.$route.query.role ? this.$route.query.role.toString() : undefined,
                })
            },
            { immediate: true }
        )
    },
    computed: {
        headers() {
            return [
                {key: 'id', sortable: false, title: this.$t("id")},
                { key: 'avatar', sortable: false, title: this.$t("avatar") },
                { key: 'name', sortable: false, title: this.$t("name") },
                { key: 'status', sortable: false, title: this.$t("status") },
                { key: 'role', sortable: false, title: this.$t("role") },
                { key: 'actions', sortable: false },
            ]
        }
    }
}
</script>
