<template>
    <v-container>
        <v-table v-if="!loading && !serverError" class="rounded-lg text-center">
            <thead>
                <tr>
                    <th class="text-center" width="3%">
                        {{ $t("id") }}
                    </th>
                    <th class="text-center" width="10%">
                        {{ $t("avatar") }}
                    </th>

                    <th class="text-center" width="20%">
                        {{ $t("name") }}
                    </th>
                    <th class="text-center" width="20%">
                        {{ $t("status") }}
                    </th>
                    <th class="text-center" width="20%">
                        {{ $t("role") }}
                    </th>
                    <th width="27%" />
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in userPerPage" :key="item.name">
                    <td>{{ $vuetify.locale.isRtl ? persianNumber(item.id) : item.id }}</td>
                    <td><v-img :src="item.avatar || '/pics/default-avatar.jpg'" class="rounded-circle my-2 mx-auto"
                            width="45px" height="45px"></v-img>
                    </td>
                    <td>{{ item.name }}</td>
                    <td><span class="px-2 py-1 rounded" :class="backgroundOfStatus(item.status)">{{
                        getStatusTitle(item.status) }}</span></td>
                    <td>{{ getRoleTitle(item.role) }}</td>
                    <td>
                        <TableRowActions :tableRowAction="tableRowAction" :user="item.id" @action="action"/>
                    </td>
                </tr>
            </tbody>
        </v-table>
        <div class="text-center my-10"><v-progress-circular v-if="loading" indeterminate
                color="primary"></v-progress-circular></div>
        <v-alert v-if="serverError" :text="$t('server error')" type="error" variant="tonal"></v-alert>
        <v-pagination :total-visible="totalVisiblePageNumber" v-if="!loading && !serverError" :length="users.length/itemPerPage+1" v-model="page" rounded></v-pagination>
    </v-container>
</template>
<script lang="ts">
import { useAPI } from "@/api"
import TableRowActions from "@/components/TableRowActions.vue"
import { IUser, Role, Status } from "@/api/authentication"
import { persianNumber } from "@/utilities"
import { ITableRowAction } from "@/components/TableRowActions.vue"
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
            currentUser: {} as IUser,
            page:1,
            itemPerPage:7,
            totalVisiblePageNumber:0
        }
    },
    methods: {
        backgroundOfStatus(status: Status) {
            if (status === Status.ACTIVE) {
                return "bg-customGreen"
            } else if (status == Status.SUSPENDED) {
                return "bg-secondary"
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
            if (role === Role.admin) {
                return this.$t("admin")
            } else {
                return this.$t("user")
            }
        },
        action(action:any){
            console.log(action.action+action.user)
        }
    },
    async mounted() {
         console.log("page:"+this.page);
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
    computed: {
        tableRowAction(): ITableRowAction[] {
            return [
                {
                    title: this.$t("show"),
                    value: "show",
                    prependIcon: "mdi-file-document-multiple-outline",
                    color: "green",
                },
                {
                    title: this.$t("edit"),
                    value: "edit",
                    prependIcon: "mdi-note-edit-outline",
                    color: "blue",
                },
                {
                    title: this.$t("delete"),
                    value: "delete",
                    prependIcon: "mdi-close-thick",
                    color: "red",
                }
            ]
        },
        userPerPage():IUser[]{
            return this.users.slice(this.itemPerPage * (this.page-1), this.itemPerPage*this.page)
        }
    }
}
</script>
