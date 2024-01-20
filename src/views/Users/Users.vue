<template>
    <v-container>
        <v-card flat title="Users" v-if="!loading && !serverError">
            <v-data-table :headers="headers" :items="users" :items-per-page-options="[
                { value: 5, title: '5' },
                { value: 10, title: '10' },
                { value: 20, title: '20' },
                { value: -1, title: 'All' }
            ]" items-per-page-text="items per page" pageText="" show-current-page>
                <template v-slot:item.status="{ value }">
                    <v-chip :color="backgroundOfStatus(value)">
                        {{ getStatusTitle(value) }}
                    </v-chip>
                </template>
                <template v-slot:item.avatar="{ value }">
                    <v-img :src="value || '/pics/default-avatar.jpg'" class="rounded-circle my-2" width="45px"
                        height="45px"></v-img>
                </template>
                <template v-slot:item.role="{ value }">
                    {{ getRoleTitle(value) }}
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
import { IUser, Role, Status } from "@/api/authentication"
import { persianNumber } from "@/utilities"
export default {
    components: {
        TableRowActions
    },
    setup() {
        return {
            persianNumber
        }
    },
    data() {
        return {
            users: [] as IUser[],
            serverError: false,
            loading: true,
            headers: [
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
            ],
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
        getStatusTitle(status: Status) {
            if (status === Status.ACTIVE) {
                return this.$t("active")
            } else {
                return this.$t("suspended")
            }
        },
        getRoleTitle(role: Role) {
            if (role === Role.ADMIN) {
                return this.$t("admin")
            } else {
                return this.$t("user")
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
                        to: { name: `oneUser`, params: { id: user.id } },
                    }
                },
                {
                    title: this.$t("edit"),
                    value: "edit",
                    props:{
                        prependIcon: "mdi-note-edit-outline",
                        color: "blue",
                        to: { name: `oneUser`, params: { id: user.id } },
                    }
                    
                },
                {
                    title: this.$t("delete"),
                    value: "delete",
                    props:{
                        prependIcon: "mdi-close-thick",
                        color: "red",  
                        to: { name: `oneUser`, params: { id: user.id } },
                    }
                    
                }
            ]
        },
    },
    async mounted() {
        try {
            const response = await useAPI().getUsers();
            this.users = response.users;
        }
        catch {
            this.serverError = true;
        }
        finally {
            this.loading = false;
        }
    },
}
</script>
