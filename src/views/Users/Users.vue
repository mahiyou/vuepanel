<template>
    <v-container>
        <v-card class="pa-3" flat v-if="!loading && !serverError">
            <v-toolbar color="white">
                <v-toolbar-title class="text-h5">
                    {{ $t('users') }}
                </v-toolbar-title>
                <template v-slot:append>
                    <SearchUser @searchUser="searchUser" />
                    <!-- <v-btn class="ms-3" variant="flat" color="green" prependIcon="mdi-account-plus-outline">{{ $t('add') }}</v-btn> -->
                </template>
            </v-toolbar>
            <v-data-table :headers="headers" :items="users" :items-per-page-options="[
                { value: 5, title: '5' },
                { value: 10, title: '10' },
                { value: 20, title: '20' },
                { value: -1, title: 'All' }
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
                    <TableRowActions :tableRowAction="tableRowAction(item)" :user="item.id" @action="action" />
                </template>
            </v-data-table>
        </v-card>
        <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate
                color="primary"></v-progress-circular></div>
        <v-alert v-if="serverError" :text="$t('server error')" type="error" variant="tonal"></v-alert>
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
export default {
    components: {
        TableRowActions,
        SearchUser
    },
    setup() {
        return {
            persianNumber
        }
    },
    data() {
        return {
            users: [] as IUser[] | undefined,
            serverError: false,
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
        action(action: any) {
            console.log(action.action + action.user)
        },
        tableRowAction(user: IUser) {
            return [
                {
                    title: this.$t("show"),
                    value: "show",
                    props: {
                        prependIcon: "mdi-file-document-multiple-outline",
                        color: "green",
                        to: { name: `editUser`, params: { id: user.id } },
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
        log() {
            console.log("dooo")
        }, async searchUser(user: ISearchUserRequest) {
            this.loading = true;
            try {
                const response = await useAPI().searchUsers({
                    id: user.id || undefined,
                    name: user.name || undefined,
                    status: user.status || undefined,
                    role: user.role || undefined
                });
                this.users = response.users;
                this.$router.push({
                    name: this.$route.name as string, query: {
                        id: user.id || "",
                        name: user.name || "",
                        status: user.status || "",
                        role: user.role || ""
                    }
                });
            }

            catch (e) {
                if (e instanceof NotFoundError) {
                    this.$router.push({
                        name: this.$route.name as string, query: {
                            id: user.id || "",
                            name: user.name || "",
                            status: user.status || "",
                            role: user.role || ""
                        }
                    });
                    this.users = undefined;
                } else {
                    this.serverError = true;
                }
            }
            finally {
                this.loading = false;
            }
        }
    },
    async mounted() {
        this.searchUser({
            id: this.$route.query.id ? parseInt(this.$route.query.id.toString()) : undefined,
            name: this.$route.query.name ? this.$route.query.name.toString() : undefined,
            status: this.$route.query.status ? this.$route.query.status.toString() : undefined,
            role: this.$route.query.role ? this.$route.query.role.toString() : undefined,
        })
    },
    computed: {
        headers() {
            return [
                {
                    key: 'id',
                    sortable: false,
                    title: this.$t("id")
                },
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
